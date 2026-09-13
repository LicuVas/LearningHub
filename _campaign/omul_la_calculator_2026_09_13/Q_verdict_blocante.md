# Verificarea adversarială a semnalărilor „blocante” (TIC, M1, V-VIII)

Verificate: 16 (15 din Q_blocante_de_verificat.json + cls6-l6-01 din F_evaluari/cls6/lectia6-proiect/log.json). Scripturi și ieșiri: `C:\Users\licuv\AppData\Local\Temp\claude\C--00-AI-0\d1ddcc30-0251-43d9-a426-7c5c0b2e2d92\scratchpad\q` (render.py, render2.py, timp.py, timp_iesire.txt, shortcuts*.py, excel_check.py).

Estimarea de timp e a mea și e favorabilă lecției: citire 150 cuv/min pe textul randat (fără rezolvările pliate), pornire 5 min, 0,5 min pe întrebare de atom, 3 min „Încearcă tu”, iar pentru Ex.1 durata minimă estimată de mine (scrisă în timp.py).

| id | lecția | verdict | gravitate corectă | pe scurt |
|---|---|---|---|---|
| cls5-l5-11 | lectia5-reguli.html | adevarat_dar_important | important | L5 singură încape (~41 min); doar împreună cu L4 în ora 2 depășește (~67 min) |
| cls5-l6-01 | lectia6-proiect.html | confirmat_blocant | blocant | Ex.1 (nivel minim) scrie explicit 30+60+30 = 120 min |
| cls5-l6-02 | lectia6-proiect.html | confirmat_blocant | blocant | Poster în PowerPoint/Paint/Canva, dar editorul grafic vine abia la ora 18; prezentările nu sunt la clasa a V-a |
| cls6-l1-01 | lectia1-powerpoint-intro.html | fals | minor (lecție strânsă, fără rezervă; ora 3 din plan e acoperită parțial tot de L1) | La 150 cuv/min, drumul minim iese ~47 min; pornirea și citirea iau ~21 min, nu ~45 |
| cls6-l2-01 | lectia2-slide-uri.html | adevarat_dar_important | important | Depășește puțin (~55 min), nu „nici pe departe”; pornirea și citirea iau ~24 min, nu 50 |
| cls6-l5-01 | lectia5-tranzitii.html | adevarat_dar_important | important | Ora 7 cu L4+L5 = ~63 min (+25%); se repară contopind cele două Ex.1 |
| cls6-l6-01 | lectia6-proiect.html | adevarat_dar_important | important | Lecția întreagă + realizare = ~63 min; dar atomii de susținere sunt chiar tema orei 8, iar Ex.3 cere susținere în fața unui coleg (în perechi) |
| cls7-l3-01 | lectia3-paragrafe.html | confirmat_blocant | blocant | Ora 6 (L2+L3): doar pornirea și citirea = ~58 min, peste 50 înainte de orice clic în Word |
| cls7-l5-01 | lectia5-tabele.html | confirmat_blocant | blocant | Doar citirea atomilor ia ~39 min; drumul minim ~64 min într-o oră care mai are text și imagini; „nici în două ore” e exagerat |
| cls7-l6-01 | lectia6-evaluare.html | adevarat_dar_important | important | Adevărat că L1-L5 nu predau Wrap Text/Crop, dar chiar lecția 6 are un atom de predare (6b) înainte de exercițiu, iar planul are ora 7 pentru imagine |
| cls7-l6-02 | lectia6-evaluare.html | confirmat_blocant | blocant | Ora 10 cere test + barem; pagina n-are puncte, arată răspunsul corect, iar pe disc testul există doar pentru V-U1 |
| cls8-l1-01 | lectia1-interfata.html | adevarat_dar_important | important | Toate 3 „Vezi rezolvarea” sunt ale altor exerciții (confirmat și după rularea JS) |
| cls8-l2-01 | lectia2-date.html | adevarat_dar_important | important | Ctrl+L/E/R sunt scurtăturile Word; în Excel sunt Create Table / Flash Fill / Fill Right |
| cls8-l3-01 | lectia3-formule.html | adevarat_dar_minor | minor | Indiciul spune 78, Excel dă 77; greșeală de adunare cu termenii scriși lângă |
| cls8-l4-01 | lectia4-functii.html | adevarat_dar_important | important | Adresa e decalată cu un rând (4 e în B8, nu în B7); făcut în Excel iese MIN 4 / AVG 7,75, nu 5 / 8 |
| cls8-l6-01 | lectia6-proiect.html | adevarat_dar_important | important | Rezolvarea Ex.1: G4 =AVERAGE(B4:F4) cu Nr., Nume, 5 materii: ia coloana cu nume (ignorată în tăcere) și sare materia 5 |

## Concluzie

1. Rezistă ca blocante 5 din 16: cls5-l6-01, cls5-l6-02, cls7-l3-01, cls7-l5-01, cls7-l6-02. Acolo ora chiar nu se poate ține: 120 min scrise în exercițiul de nivel minim, unelte nepredate, citire care umple ora, lipsa testului cu barem.
2. Adevărate, dar nu blocante: 9 „important” + 1 „minor” (cls8-l3-01). Una e falsă: cls6-l1-01 (la 150 cuv/min drumul minim iese ~47 min).
3. Tiparul la cele pe timp: verdictul „nu încape” stă pe ritmurile provizorii (~90-100 cuv/min), iar la 150 cuv/min scade de ~2 ori. Mai des, evaluatorul pune o lecție într-o singură oră, deși planul îi dă și ora următoare fără fișier propriu (cls6 L1/L2), sau materia se poate muta la ora vecină (cls6 L6 -> ora 8, susținere în perechi).
4. Tiparul la cele de conținut (cls8 L1-L6, cls7 L6 imagine): greșelile sunt reale și reproduse (LibreOffice, pagina Microsoft, DOM după JS), dar strică autoverificarea sau un exemplu, nu ora. Gravitatea corectă e „important”, iar la indiciul cu 78 „minor”.
