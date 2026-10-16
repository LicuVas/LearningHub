# Judecata 2 (țintită) — lecțiile 1 cu codul, după reparare (16.10.2026)

Ești judecător PROASPĂT. Nu rejudeci lecția de la zero: verifici întâi punctele deschise, apoi faci o baleiere scurtă. Verdictul tău decide publicarea (0 GRAV / 0 MAJOR = R7).

## Citește întâi
1. `C:\00\Projects\LearningHub\_campaign\revizuire_completa_2026_09\v1_cu_cod_2026_10_16\prompturi\_judecator.md` — regulile judecătorilor (arbitrul = caseta ADEVĂRATĂ servită local, cu serverul fals local care mută și `api` pe 127.0.0.1; INTERZIS orice spre servicii reale; `ctx.close()`; nu modifici lecția; nu faci commit). Din `06_BRIEF_JUDECATOR.md` și `05_STANDARD_LECTIE.md` citești doar ce îți trebuie pentru punctele de verificat.
2. REGISTRUL punctelor de verificat:
   - raportul judecății 1 al lecției: `lectii\<clasa>\m1-l01\_verificare\judecator_cod1.md` + `.json` (fiecare GRAV/MAJOR/MINOR);
   - `…\v1_cu_cod_2026_10_16\REGISTRU_COMUN.md` (C1-C23): punctele care se aplică lecției tale;
   - la V/1 și: `…\cititori_v1\REZULTATE.md` (blocajele cititorilor-începători);
   - răspunsul reparatorului (ți-l dă dirijorul în prompt): ce spune că a reparat și unde.
3. Copia lecției de dinaintea reparării, dacă reparatorul a făcut una (`_proba\`), ca să vezi diferențele.

## Ce faci
1. Pentru FIECARE punct GRAV/MAJOR din registru (judecata 1 + C# aplicabile): stare `închis` / `deschis` / `nou`, cu dovada: citatul din lecția de ACUM (≥12 caractere, verificat mecanic) și, unde e un drum, drumul urmat LITERAL pe caseta adevărată (1280 + 390 cu atingere). Punctul nu se închide pe cuvântul reparatorului.
2. MINOR-urile: le verifici repede (citat), fără probe lungi.
3. Baleierea scurtă: textul NOU introdus de reparare (definiții, propoziții noi) — e adevărat pe caseta adevărată? termen nou folosit înainte de explicație? contrazice altceva din lecție? plafonul (oracolul)? I4 (numără cuvintele drumului obligatoriu, compară cu judecata 1).
4. Porțile, rulate de tine: `test_joc.py` · `verifica_lectie.py --fara-t1` (ultima linie) · oracolele R6 · `lectii\_sim\_teste\intrare_cod_texte.py` · `learninghub_date_personale.py`.
5. Dacă `lectii\_sim\intrare-cod.js` s-a schimbat (sha1 diferit de c8c6b4ae…; vezi `intrare-cod.GATA.md`): exersarea din lecția TA merge pe versiunea nouă? (`rezolva`/`gresit` pe fiecare „Încearcă” cu caseta).

## Ieșiri
`_verificare\judecator_cod2.md` + `.json` (registrul punctelor cu starea fiecăruia + problemele noi). Ultima linie a .md = DOAR numărul de GRAV. Răspunsul final: `{"grav":N,"major":N,"minor":N,"registru":{"inchise":N,"deschise":[…],"noi":[…]},"porti":{…},"I4_cuvinte":N,"verdict":"publicabil|publicabil dupa reparatii|respinsa"}`.
