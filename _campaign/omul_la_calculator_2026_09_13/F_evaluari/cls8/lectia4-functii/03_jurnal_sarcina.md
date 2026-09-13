# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului pe care îl joc (U11)
- 14 ani, clasa a VIII-a, a făcut lecția 3 (formule, SUM) **înainte de vacanța de toamnă** — ultima oră de calcul tabelar a fost pe 20.10 (Izvoare) / 23.10 (Brauner); ora aceasta e pe 03.11 / 06.11. Au trecut ~2 săptămâni.
- NU știe: ce e un „argument”, că virgula din formulă poate fi „;” pe calculatorul lui, că „Function Wizard” nu scrie nicăieri pe ecran, că 7.25 apare ca 7,25.
- NU vede: rezolvările pliate (le deschide doar dacă se blochează), feedbackul quiz-ului înainte să răspundă.
- Timp: 50 de minute, din care pornirea PC + logare + deschiderea programului (poarta socotește 8).
- Citește încet; cu 3.685 de cuvinte în lecție, sare peste explicații și se uită la pași și formule.
- Nu știu ce Excel/limbă/regiune are PC-ul lui (necunoscut, `04_mediu.md`).

## Povestea pașilor
1. **Încearcă, pașii 1-4.** Scriu „Elev”, „Nota”, apoi 8 note în B2:B9. Coloana A rămâne goală sub „Elev” (lecția nu dă nume — un începător se întreabă dacă a greșit). Scriu etichetele în D și formulele în E: MIN 4, MAX 10, medie **7,25** pe Windows în română (lecția nu dă media aici, deci nu se încurcă încă), COUNT 8 ca în lecție. Blocul „Copiaza” se lipește corect din E2 (o formulă pe rând).
2. **Pasul 5, butonul fx.** Butonul există (Microsoft ro-ro: caseta „Inserare funcție”). Lecția îl numește „Asistentul de functii (Function Wizard)”; în caseta care se deschide scrie „Inserare funcție” / „Insert Function”. În caseta de căutare, pe interfață în română, dacă scrie „media” nu știu ce găsește (neverificat). Aici e **primul blocaj probabil** („Nu văd Function Wizard”).
3. **Pasul 6: „Schimba nota din B4 din 10 in 3”.** Mă uit la B4: e **5**, nu 10. Nota 10 e în B5. Elevul fie schimbă B4 (5 → 3: MIN devine 3, MAX rămâne 10, media 7), fie caută nota 10 și schimbă B5 (MIN 3, MAX 9, media 6,375). Recalcularea automată merge oricum, dar primul lucru pe care îl vede e că lecția nu se potrivește cu foaia lui — „am greșit ceva la pasul 1?”. **Blocaj sigur, reprodus** (`u5_reproducere.txt`).
4. **Bonusul COUNTA.** E6 = 8. Șterg o notă: COUNT 7, COUNTA 7. „Ce e diferit?” — nimic. Pliantul spune că diferența apare cu textul „absent”, dar pasul cere ștergere. Elevul bun e confuz, elevul slab trece mai departe fără concluzie.
5. **Atomii 1-9.** Răspund corect la toate 9 întrebările (cheile verificate în LibreOffice, `04_a_doua_cale.json`). Atomul 3 (MIN și MAX) întreabă de AVERAGE, predat abia în atomul 4 (a apărut însă în Încearcă). Atomul 6 (butonul fx) nu are nicio întrebare despre fx.
6. **Atomul 8, scenariul.** „Schimbam B7 din 4 in 10”: în foaia mea B7 = 6. Dacă îl fac în Excel literal: MIN 4, media 7,75 — tabelul lecției spune 5 și 8. Întrebarea de verificare dă lista notelor explicit, deci răspunsul „8” se poate alege corect din listă, dar **nu din foaie**.
7. **Atomul 9, IF.** Proba rapidă: A1=4 → „Corigent”, A1=7 → „Promovat” (verificat). **Aici se schimbă tastarea**: e prima formulă din lecție cu mai multe argumente scrisă de elev. Pe Windows în română, `=IF(A1>=5,"Promovat","Corigent")` cu virgulă nu e acceptată (separatorul de listă „;” pe ro-RO, `u4_cultura.txt`); lecția nu pomenește asta. **Blocaj probabil, depinde de setarea necunoscută.**
8. **Ex. 1.** Catalog cu 5 elevi: 35/5/9/7/5, după Dan = 10: 40/6/10/8/5 — identic cu lecția. Aici adresa (B5 = Dan) e corectă. Exercițiul e bun.
9. **Ex. 2.** Stația meteo: tastare lungă (~150 de caractere de date). Media temperaturii apare **20,71429** pe ro-RO; rezolvarea spune 20.71. Instrucțiunea de rotunjire e în engleză („Home -> Number”); în română: fila Pornire, grupul Număr, „Mărire zecimală / Micșorare zecimală”. F2:F4 fără etichete — elevul nu mai știe care e min și care e max.
10. **Ex. 3.** Pe hârtie, 6/8/3/10/7 — rezolvarea corectă. Merge integral fără calculator.
11. **Provocarea.** `=IF(AVERAGE(B2:B5)>=5,...)` merge; indiciul „AVERAGE poate sta în locul condiției” e imprecis (stă *în* condiție).

## Unde se blochează un începător (ipoteze AI — de verificat la oră)
- „În B4 nu e 10” (pasul 6) și „mie îmi dă 7,75, nu 8” (atomul 8) — **reproduse**, nu doar ipoteze.
- „Nu găsesc Function Wizard.”
- Formula IF cu virgulă refuzată (dacă Windows e în română).
- „7,25 sau 7.25?”; „20,71429 — am greșit?”
- „Am șters nota și COUNT și COUNTA sunt tot la fel.”
