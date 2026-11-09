# Repararea după judecata 1 (R1) — șablon comun al turei 08→09.11; lecția ți-o numește dirijorul în mesaj

Ești autor PROASPĂT (n-ai scris lecția). Citești `07_BRIEF_AUTOR.md` și lanțul de prompturi comune, inclusiv `m5_noapte_08_11\prompturi\_noapte_08_11.md`; modelul de reparare: `m4_seara_02_11\prompturi\r1_v28.md`. Legea: `00_GHID_LECTII.md` (Partea I + părțile autorului, cât îți trebuie; Grep întâi). Citești apoi lecția, `_proba\stare_autor.md`, granița ei și **cele două rapoarte de judecată**: `_verificare\judecator1.md` (opus) și `_verificare\ab_sonnet\judecator1.md` (sonnet).

**Pasul 1: registrul.** Scrii `_verificare\registru_j1.md`: reuniunea celor două rapoarte, dublurile unite, fiecare constatare cu id (literă), gravitate (cea mai mare dintre cele două), citat, reparația, locul, proba. Decizia pe fiecare: **repar**, sau **resping** numai cu o probă VIE rulată de tine (fișierul probei trecut în registru). Nu respingi pentru că e greu sau pentru că durează. Tot GRAV, MAJOR și MINOR se tratează: 100 %.

**Pasul 2: repararea.** Copia dinainte în `_proba\inainte_r1\`. Repari în ordinea gravității. Editezi cu Edit sau cu un script pe bytes (CRLF păstrat). Durata nu are voie să crească (`j2_durata.py` al judecătorului, înainte și după, dacă există; altfel metoda judecătorului, cu cele două cifre). Când nu încape, tai din citit, nu din gesturile reale. Mesajele spun numai ce e sigur adevărat (regula 28). Fiecare reparație are o probă în `_proba\`, care pică pe versiunea dinainte (rulezi pe `inainte_r1`, cifra trece în registru).

**Pasul 3: porțile, după ultima schimbare:** `test_joc.py` TRECUT, `verifica_lectie.py --fara-t1` → 0, Playwright 390 cu atingere + 1280 → 0 erori, oracolele lecției (la evaluări `verifica_regula.py`, `oracol_nota_site.py`), `proba` numărului din panou (`activitate.py lista | grep -c "nu e în catalog"`, CU î, nu crește; nu-i salvezi ieșirea). Ieșirile lungi în `_proba\*.txt`, în context doar coada. `_proba\stare_autor.md` la zi. Dacă schimbi ceva pe care îl citește o lecție vecină, scrii în graniță „SCHIMBAT <ora din ceas>: …”. Nu atingi simulatoarele comune; o extensie a lecției tale, da. Ce ține de o componentă comună rămâne la `Pentru componenta comună`, în `surse.md`.

**Nu publici, nu faci commit, nu atingi alte lecții. Nimic pe ecranul vizibil.**

**Răspunsul final (scurt):** câte puncte, câte reparate / respinse (cu proba), ce porți ai rulat după ultima schimbare, cifrele duratei înainte și după, ce trebuie să știe judecătorul 2.
