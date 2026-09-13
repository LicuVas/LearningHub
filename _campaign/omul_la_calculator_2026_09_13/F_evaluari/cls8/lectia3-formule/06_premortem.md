# 06 — Pre-mortem (U14) și explicații alternative (U13)

*Schița scrisă după pasul 1 (citit înapoi), completată la pasul 5 cu verificările făcute.*

„Ora de 23.10.2026 (Brauner) / 20.10.2026 (Izvoare) cu lectia3-formule a eșuat. De ce?”

## U14 — cinci motive, fiecare cu verificarea

1. **Elevii au crezut că au greșit, deși lucraseră corect.** Ipoteză la schiță: un număr de control din lecție nu iese.
   *Verificare:* `u5_reproducere.txt` — indiciul pasului 5 spune 78; LibreOffice, Python și tabelul din atomul 6 dau 77. **Confirmat.** Și verificarea Ex. 1 „media 7.50” nu apare pe ecran cu format General (7,5 pe ro-RO, `randat_xlsx/ex1_medie.pdf`).
2. **Nu a ajuns timpul.** Schița: lecție lungă + două noțiuni grele (relativ/absolut).
   *Verificare:* poarta calculează din `03_pasi.json` și `masuri.json` (3.242 de cuvinte): peste 50 de minute; la ritm dublu încape. Plus: ora are conținut din ora 8 (SUM). **Confirmat ca risc, nu ca blocaj** (ritmurile sunt provizorii).
3. **La Izvoare nu există calculatoare.** Schița: lecția e gândită doar pentru Excel.
   *Verificare:* nu se poate fără sală, pentru că prezența unui calculator/videoproiector la Izvoare e neconfirmată (`B_context_real.md` §3). Am verificat în schimb ce merge pe hârtie: atomii 1-3 și 5 (operatori, ordinea operațiilor: `=2+3*4` = 14 confirmat), tabelul final (formulele scrise în caiet pe celule, rezultatele verificate: 26/24/27/77), Ex. 3 integral (`produs_elev/ex3_raspunsuri_elev.txt`). Tragerea în jos și `$B$1` se pot simula pe caiet („scrie formula din C4 după copiere”) — lecția nu oferă varianta.
4. **Explicația pentru `$` nu s-a potrivit cu ce au văzut elevii.** Schița: exemplul cu „celule goale” e prea frumos.
   *Verificare:* foaia `Fara_dolar` — C4 = #VALUE!, C5 = 1575 (07_redeschis.json). **Confirmat**: nu sunt celule goale, iar eroarea tăcută (1575) nu e numită.
5. **Elevii nu au găsit butoanele/termenii pe ecran.** Schița: interfață în engleză, termen inventat.
   *Verificare:* „drag handle” are 0 apariții în Microsoft Support en-us (acolo e „fill handle”) și în ro-ro e „instrumentul de umplere” (`surse/umplere_*.txt`); „Format Cells” = „Formatare celule” în ro-ro. Limba Office-ului din laborator: nu se poate afla fără sală.

## U13 — explicații alternative pentru semnalările grave

**A. „78” în indiciu (cls8-l3-01).**
- *Explicația 1:* greșeală de aritmetică la scrierea indiciului.
- *Explicația 2:* indiciul se referă la alt tabel (de ex. alte note în Încearcă, la o versiune anterioară), iar datele s-au schimbat după.
- *Observația care le deosebește:* dacă notele din blocul copiabil al Încearcă dau 78 cu vreo combinație plauzibilă, sau dacă indiciul pasului 2 („27 (adica 9 + 8 + 10)”) folosește alte date. Făcută: blocul are 9/8/10, 7/6/8, 10/10/9; indiciul pasului 2 dă 27 pe aceleași date; indiciul pasului 5 scrie chiar „(27 + 21 + 29)” — adunarea termenilor listați e 77. **Explicația 1** — greșeala e în adunare, nu în date. Pentru elev efectul e identic.

**B. „celule goale” în rezolvarea Ex. 2 (cls8-l3-02).**
- *Explicația 1:* autorul și-a imaginat tabelul fără rândul de antet.
- *Explicația 2:* în Excel (nu LibreOffice) un text înmulțit ar da altceva decât #VALUE!, deci „defectul” ar fi al randării mele.
- *Observația:* (1) blocul starter al lecției are rândul „Cheltuiala / Pret/elev / Cost total” în rândul 2 (HTML r. 562, lipit pe Tab → B2 = „Pret/elev”) — deci antetul există. (2) Microsoft documentează #VALUE! pentru operații aritmetice cu text — **nedescărcat pe text brut aici**, deci consider C4 doar „probabil #VALUE! și în Excel”; C5 = 35 × 45 = 1575 nu depinde de program (aritmetică pe două numere). Semnalarea stă pe C5 și pe B2 ne-gol, nu pe tipul exact al erorii.

**C. TVA 19% (cls8-l3-03).**
- *Explicația 1:* lecție scrisă înainte de 01.08.2025.
- *Explicația 2:* 19% ales intenționat ca număr didactic, nu ca realitate.
- *Observația:* lecția nu marchează nicăieri că e „un exemplu”, iar în „Deschidere” scrie „de exemplu TVA de la 19% la 21%”, deci autorul știa de schimbare. Git log nu am căutat (nu schimbă ce vede elevul). Oricum, un contabil din 2026 ar corecta: fie 21%, fie „cota din B1” fără cifră de lege.
