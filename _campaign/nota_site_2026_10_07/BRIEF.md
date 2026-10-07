# Brief — lecțiile 1 (V, VI, VII, VIII): nota lucrării de modul = 80% lucrarea + 20% munca pe LearningHub (07.10.2026)

Decizia profesorului e luată (06.10.2026, aprobată în întregime pe 07.10.2026, 09:25). Tu doar o pui în lecții, exact.
Sursele: `C:\00\Projects\Info_Gimnaziu_2026\SISTEM_EVALUARE.md` §4.5 (citește-l întâi), regula în cod
`C:\00\AI_0\tools\nota_site.py`, fișa elevului `C:\00\Projects\Info_Gimnaziu_2026\instrumente\Fisa_criterii_elev_clasa_<X>.md`
(secțiunea „Munca mea pe LearningHub”), contractul `C:\00\AI_0\projects\teste-elevi\contracte\2026-10-06_nota_activitate\contract.md`.

## Regula (exact asta, nimic în plus)
- La lucrarea (sau proiectul) de modul, **nota din catalog = (0,8 × punctajul lucrării + punctele de pe LearningHub) : 10**,
  rotunjită la cel mai apropiat întreg, la ,5 în favoarea elevului. Punctajul lucrării rămâne cel de acum (C 40, B 30,
  A 20, 10 din oficiu, din 100). Pe site: **cel mult 20 de puncte**:
  **2 din oficiu** · până la **8** dacă termină ce s-a dat clasei · până la **6** dacă lucrează fără „Arată-mi răspunsul”
  și nimerește din prima · până la **4** pentru ce face în plus (jocuri de antrenament, „Vrei mai mult”).
- Exemplele de folosit: 100 de puncte la lucrare și nimic pe site → (80 + 2) : 10 = 8,2 → **8**; 60 de puncte și tot pe
  site → (48 + 20) : 10 = 6,8 → **7**; 55 de puncte și nimic → 4,6 → **5**; 50 și nimic → 4,2 → **4**.
- **Minutele nu contează**, contează ce termini. **Se aplică de la ora la care profesorul anunță regula**; ce ai făcut
  înainte poate doar să te ajute. **Fără calculator sau internet acasă:** aceeași muncă la oră, la calculatorul școlii,
  sau pe foaie. **Absent motivat:** lecția din ziua aceea nu se numără. **Copiatul și lucrarea nepredată:** tot nota 1.

## Ce schimbi în fiecare lecție `C:\00\Projects\LearningHub\lectii\<cls>\m1-l01\index.html`
1. **Pasul despre lucrare și notă** (cel cu „punctaj : 10”: VIII „Lucrarea: trei părți și nota”, VII „Din puncte,
   nota”, VI „Lucrarea și nota ei”, V: caută-l): păstrează calculul notei lucrării; adaugă O propoziție care trimite
   la pasul nou, cu cuvântul „LearningHub” (de ex. „La lucrarea de modul, în catalog intră și munca ta pe
   LearningHub: pasul următor.”). Nu schimba răspunsurile exercițiilor existente; dacă vreo întrebare spune „nota din
   catalog” pentru un calcul fără site, reformuleaz-o „nota lucrării”.
2. **Un pas NOU, imediat după**, cu titlul care conține „LearningHub” (de ex. „Munca ta pe LearningHub: 2 puncte din
   notă”), în forma pașilor din lecție (text, exemplu „Uite cum”, „altfel”, `incearca` + `inca`, ca vecinii lui).
   Textul spune regula de mai sus pe înțelesul clasei: la V, procentele nu s-au învățat încă la matematică — spune
   „lucrarea se socotește din 80 de puncte în loc de 100, iar cel mult 20 le aduci de pe LearningHub” (sau „păstrezi
   8 părți din 10 din punctajul lucrării”), fără „%” nedefinit; de la VI în sus poți folosi și „80%”. Exercițiul
   „Încearcă tu” calculează nota din catalog pe 2–4 cazuri (cifrele să iasă exact, verifică-le cu
   `python C:\00\AI_0\tools\nota_site.py <punctaj> <puncte_site>`). Cuprinde obligatoriu: 80/20, cele 20 de puncte
   și părțile lor, oficiul, „Arată-mi răspunsul”, minutele, anunțul, calea fără calculator acasă, absența motivată,
   exemplul „nimic pe site → 8”.
3. Orice alt loc din lecție care descrie nota (recapitulare, întrebări de final, „ce ai aflat”, profil) să fie
   consecvent cu regula.
4. La final: `surse.md` (secțiune nouă „Nota cu munca pe LearningHub, 07.10.2026”: ce ai schimbat + citatul din
   SISTEM_EVALUARE §4.5), `afirmatii.json` și `profil.json` ale lecției, ca să spună adevărul despre pagină.

## Regulile casei (obligatorii)
- `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\05_STANDARD_LECTIE.md`: textul unui pas 30–110
  cuvinte, „Uite cum” ≤ ~80, un pas = o idee, „Altfel” spune exact ce spune pasul, niciun termen înainte de a fi
  explicat, propoziții scurte, fără notații în loc de cuvinte. Cuvintele lecției, nu jargon.
- NU atinge `assets\js\prezenta.js`, `jocuri\_motor\*`, `lectii\_sim\*`, `plan.json`, alte lecții. NU faci git
  commit/push (publicarea o face coordonatorul cu `publica_lectie.py`). Nicio dată personală (nume, e-mail) în ce scrii.
- Orice probă în browser: situl servit LOCAL, `ctx.route` care abandonează tot ce nu e 127.0.0.1/localhost, închidere cu
  `ctx.close()` (vezi `lectii\viii\m1-l01\_proba\server_local.py`). Scripturile cu regex: scrise ca fișier și rulate,
  niciodată heredoc. Căi absolute, fără `cd`.

## Oracolele (toate trebuie să dea 0 la final)
```
python C:\00\Projects\LearningHub\_campaign\nota_site_2026_10_07\oracol_nota_site.py          (acum: 8)
python C:\00\Projects\LearningHub\_campaign\notare_punctaj_2026_09_29\verifica_regula.py
python C:\00\Projects\LearningHub\_campaign\isj_aliniere_2026_10_01\oracol_m1l01.py <cls>/m1-l01   (pentru fiecare)
python C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\verificare_lectii\verifica_lectie.py C:\00\Projects\LearningHub\lectii\<cls>\m1-l01\index.html --fara-t1
python C:\00\Projects\LearningHub\jocuri\_motor\test_joc.py --dir C:\00\Projects\LearningHub\lectii\<cls> m1-l01
```
(La `test_joc.py`, verifică întâi în `publica_lectie.py` r. 70–76 forma exactă a argumentelor.)

## Ce întorci
Pe fiecare lecție: titlul pasului nou, textul lui (copiat), numărul de cuvinte, exercițiul cu răspunsurile și calculul
fiecăruia, ieșirea (ultima linie) a fiecărui oracol. Orice abatere de la brief, spusă pe față.
