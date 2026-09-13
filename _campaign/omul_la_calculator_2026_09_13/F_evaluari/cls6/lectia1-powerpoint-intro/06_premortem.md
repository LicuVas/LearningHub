# 06 — Pre-mortem (U14), explicații alternative (U13), sala reală (U17)

Schița celor 5 motive a fost scrisă după citirea înapoi (pasul 1); verificările au fost adăugate după pașii 2-4.

## „Ora de 15.09 (Izvoare) / 18.09 (Brauner) a eșuat. De ce?”

| # | Motiv | Verificarea făcută | Rezultat |
|--:|:--|:--|:--|
| 1 | **Nu încape**: elevii citesc teoria și ora se termină înainte de primul exercițiu | `u12_sensibilitate.txt` (formulele și ritmurile porții) | **Confirmat.** 3.740 de cuvinte = 37 min de citit; cu pornirea = 45 min înainte de orice exercițiu. Încearcă tu + Ex.1 (nivelul minim) = 82 min; la ritm dublu 45 min. Toată lecția: 143 min (75,6 la ritm dublu). |
| 2 | **Nu e ora din plan**: ora 2 cere „Ce este o prezentare bună”, iar lecția nu are nimic despre asta; în schimb predă salvarea (ora 3) și operațiile cu diapozitive (orele 4-5) | Comparat `Calendar_ore_VI.md` cu textul atomilor (`01_citit_inapoi.md`) | **Confirmat.** Zero reguli de estetică; orele 3-5 rămân fără material nou. |
| 3 | **Elevii nu găsesc butoanele**: PowerPoint în română sau LibreOffice | Numele românești din Microsoft Support, text brut (`04_mediu.md`, `surse/`) | **Parțial confirmat:** toate numele de file/comenzi diferă în română; tastatura (Ctrl+M, F5, Esc, Ctrl+S) e aceeași. Ce program are laboratorul — **nu se poate afla fără sală**, pentru că dotarea nu e în niciun document. |
| 4 | **Ex.1 se blochează la imagini**: elevii n-au imagini pe PC și/sau n-au internet | Am construit Ex.1: fără fișiere de imagine pregătite, pasul nu se poate face (`u1_iesire.txt`, imagini generate de mine) | **Confirmat pe produs;** dacă laboratorul are internet — nu se poate verifica fără sală. |
| 5 | **Izvoare: fără calculatoare** — lecția e integral la calculator | Grep `<img` în HTML = 0 imagini; toate sarcinile cer programul deschis | **Confirmat pe lecție:** nu există nicio variantă pe hârtie și nicio captură a ferestrei de tipărit. Dacă Izvoare are totuși un PC + proiector — nu se poate afla fără sală. |

## U13 — explicații alternative pentru semnalările grave

**S1 (timpul, blocant).** *Alternativa:* exercițiile sunt pe niveluri; nimeni nu le face pe toate, deci „143 min” e o sumă artificială. *Observația care le deosebește:* calculez doar drumul minim (Încearcă tu + Ex.1). *Făcut:* 82,2 min la ritmul provizoriu → tot nu încape; încape doar dacă elevii citesc de două ori mai repede decât ritmul provizoriu (45,1 min, fără nicio rezervă). Alternativa a doua: ritmul de 100 cuv/min e prea lent. *Făcut:* chiar și doar citirea + pornirea = 45,4 min la ritmul provizoriu, 26,7 la dublu — deci verdictul depinde de ritm, dar la ritmul provizoriu ora e plină doar cu teorie.

**S2 (nepotrivirea cu planul).** *Alternativa:* „ce este o prezentare bună” se face oral de profesor, iar lecția e doar suportul pentru interfață. *Observația:* caut în planificare/lecție un material pentru partea orală. *Făcut:* lecția nu are nicio mențiune; calendarul trece „Reguli de estetică și ergonomie” abia la ora 8 (03.11), iar lecția 2-6 de pe site nu au lecție dedicată (B_context_real.md §2: ora 8 „nu corespunde”). Deci nici mai târziu elevul nu primește regulile pe site.

**S3 (Ex.2 ambiguu).** *Alternativa:* elevul de a VI-a înțelege natural „slide-ul 5” ca poziție, deci nu e ambiguu. *Observația:* ce vede elevul pe diapozitivul de pe poziția 5 după inversare. *Făcut:* pe poziția 5 scrie **4** (pentru că a inversat), deci „slide-ul 5” are pe ecran un 5 pe poziția 4 și un 4 pe poziția 5 — exact situația care îi încurcă; rezultatele diferă (8,6,4,3,1 vs 7,5,5,3,1), iar ștergerea pe rând nici nu se poate termina.

**S4 (nume englezești).** *Alternativa:* laboratorul are Office în engleză, deci lecția e corectă pentru el. *Observația:* ce limbă are PowerPoint-ul din sala 1 TIC — **nu se poate face de aici**; de aceea semnalarea e `depinde_de_necunoscut` și propune ambele nume.

## U17 — Sala reală
- **Brauner, 6A în sala 1 (TIC), vineri 18.09, 8:00:** lecția se poate ține la calculator dacă PC-urile au PowerPoint; dacă au LibreOffice Impress, „Încearcă tu” și toate exercițiile trebuie rescrise pe loc.
- **Brauner, 6M (sala 4):** laborator sau clasă obișnuită — deschis; dacă e clasă obișnuită, e aceeași situație ca Izvoare.
- **Izvoare, VI, marți 15.09, 9:00 (ipoteza: fără laborator):** lecția **nu se poate ține pe hârtie așa cum e** — n-are nicio imagine a ferestrei, iar toate sarcinile cer programul. Ce trebuie pregătit: o fișă A4 cu captura etichetată a ferestrei PowerPoint (panglică, panoul de miniaturi, zona de editare, note, bara de stare) și sarcina „schițează pe caiet o prezentare de 5 diapozitive despre tine: ce scrii pe fiecare, ce imagine ai pune, ce spui în note” — asta acoperă și „ce este o prezentare bună” (o idee pe diapozitiv), care lipsește din lecție.
