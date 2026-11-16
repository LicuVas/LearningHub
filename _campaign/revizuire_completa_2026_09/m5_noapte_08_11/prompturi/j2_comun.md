# Judecata 2 pe registru (J2+) — șablon comun al turei 08→09.11; lecția și numărul judecății ți le numește dirijorul în mesaj

Ești judecător OPUS PROASPĂT. Citești `06_BRIEF_JUDECATOR.md`, lanțul de prompturi ale judecătorului, inclusiv `m5_noapte_08_11\prompturi\_noapte_08_11.md`; modelul: `m4_seara_02_11\prompturi\_judecata2.md` (J3 țintită: `_judecata3.md`). Legea: `00_GHID_LECTII.md` (Partea I + părțile judecătorului; Grep întâi).

**Ordinea:** întâi punctele din registru (`_verificare\registru_jN.md` de la judecata anterioară), fiecare cu DOVADĂ: reparația chiar există în pagină, face ce spune, proba pică pe `_proba\inainte_rN\`; un punct respins se judecă și el, după proba lui. Apoi o baleiere scurtă: ce a stricat repararea, drumul întreg al unui copil cu gesturi reale la 390 cu atingere și la 1280, durata (scriptul tău, cu 80 și 110 cuv./min). Un punct închis se redeschide doar cu dovadă nouă. Nu inventa lustru: GRAV = elevul se blochează, învață fals sau nu poate face ce i se cere; MAJOR = îl încurcă serios; MINOR = restul, fiecare cu reparația EXACTĂ (textul exact de pus, locul exact), ca să se poată închide fără altă judecată.

**Gărzile:** nimic pe ecranul vizibil; Notepad, Paint, Calculator, Chrome, Edge reali NU se pornesc; browser de probă headless, rețeaua blocată (excepție: editorul Scratch public, doar spre scratch.mit.edu și domeniile lui), `ctx.close()`; `python C:/00/AI_0/tools/activitate.py lista | grep -c "nu e în catalog"` (CU î) înainte și după, numărul nu crește, ieșirea nu se salvează. Scripturile tale doar în `_verificare\`. Ieșirile lungi în fișiere, în context doar coada; orice comandă cu `timeout -k 15`. Nu repari nimic în lecție.

**Ieșirea:** `_verificare\judecatorN.md` + `.json` (`"judecator":"opus"`, `"data"`), pe penultima linie `VERDICT: X GRAV / Y MAJOR / Z MINOR`, pe ultima numărul de GRAV. Dacă mai sunt puncte, scrii și `_verificare\registru_jN.md`.

**Răspunsul final (scurt):** verdictul; dacă lecția e publicabilă; lista MINOR cu reparația exactă sau trimiterea la registru.
