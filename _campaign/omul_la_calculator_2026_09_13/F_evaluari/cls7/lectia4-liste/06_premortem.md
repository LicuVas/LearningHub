# 06 — Pre-mortem (U14) + explicații alternative (U13) · lectia4-liste

**Schița a fost scrisă după pasul 1 (cu context proaspăt); mai jos, fiecare motiv cu verificarea făcută.**

## U14 — Ora de 20.10.2026 (VII A/VII B) / 23.10.2026 (7 MA) a eșuat. De ce?

1. **Timpul.** Verificat (`u12_sensibilitate.txt`): 4.742 de cuvinte, 10 atomi (spec 4-8) → 92,5 min la poartă; la ritm dublu 50,2 min. Doar exercițiile în Word + răspunsurile, fără citirea atomilor: 51,3 min. Fără răspunsurile scrise: 79,3 (43,7 la ritm dublu). → **confirmat**: ora nu încape cum e scrisă; încape doar dacă răspunsurile pe site devin opționale și atomii se predau frontal.
2. **Ora nu e a listelor.** Verificat (`01_citit_inapoi.md`, `Calendar_ore_VII_A.md`, `Calendar_ore_7_MA.md` r.17): ora 7 = „Formatarea imaginii, a tabelului și a paginii”; programa nu numește listele. JURNAL (lecția 3) mută tot aici restul lecției 3. → **confirmat**: la ora 7 se ciocnesc trei conținuturi; după ea urmează vacanța și ora 8 e deja „Reguli de tehnoredactare”.
3. **Ex.3 se contrazice cu propria rezolvare.** Verificat (`u3_iesire.json`, `randat_docx/Tema_Liste_p3.png` vs `Ex3_dupa_rezolvare_Tab_p1.png`, `04_a_doua_cale.json` r.4): rezolvarea Ex.3 promite marcatori după Tab, rezolvarea Ex.2 promite litere pentru aceeași apăsare. → **confirmat în text**; ce face Word-ul din laborator = neclar, dar oricare ar fi, una din cele două rezolvări e greșită.
4. **Butoanele în engleză.** Verificat (`04_mediu.md`, `surse/s01`, `s02`, `s04`): 0 denumiri românești în lecție; pe Word ro butoanele se cheamă Marcatori, Numerotare, Listă multinivel, Definire format nou de numerotare, Repornire de la 1. → confirmat pentru documentație; **limba din laborator nu se poate afla fără sală** (depinde_de_necunoscut).
5. **Izvoare, fără laborator.** Nu se poate verifica fără sală, pentru că dotarea Izvoare e doar ipoteză (B_context_real §3). Verificat ce ține de lecție (`u_anexa_grep.txt`): 0 imagini; singurul „desen” al unei liste pe niveluri (atomul 4) apare **plat**, fără retragere (`pas_04.png`; HTML: rânduri separate doar cu `<br/>`). Pe caiet se pot face Ex.1-Ex.3 ca liste scrise de mână (marcatori, numere, retrageri) — ideea de listă se predă; Define New Number Format, Continue Numbering, sortarea, AutoFormat nu.

## U13 — explicații alternative pentru semnalările grave

**A. „Ex.3: Tab nu dă marcatori”**
- Alternativa 1: Word-ul din laborator are ca listă implicită una multinivel în care nivelul 2 e marcator → rezolvarea Ex.3 ar fi corectă, iar Ex.2 greșită.
- Alternativa 2: autorul a vrut să spună „apasă Tab, apoi Marcatori” și a sărit pasul.
- Observația care le deosebește, făcută: am citit ce spune aceeași lecție despre același gest în alte două locuri — atomul 4 (exemplul 1. / a. / i., r.377-393) și rezolvarea Ex.2 (r.1059: „Word schimba automat numerotarea in litere”). Lecția însăși susține varianta „litere”; deci contradicția există indiferent de laborator. Pe documentație, nicio pagină nu descrie formatul nivelului 2 (`03_pasi.json` pas 9, neclar) — de aceea gravitatea e `important`, nu `blocant`.

**B. „Clic pe marcator + Ctrl+A = toată lista” e greșit**
- Alternativa 1: în unele versiuni Ctrl+A, cu marcatorii selectați, ar extinde selecția doar la listă.
- Alternativa 2: autorul a vrut „clic pe marcator” (care deja selectează lista) și Ctrl+A e un adaos.
- Observația, făcută: pagina Microsoft de scurtături (en-us și ro-ro, `surse/s03`) definește Ctrl+A fără excepție: „Selectați tot conținutul documentului”; pagina despre marcatori spune că un clic pe marcator selectează toți marcatorii. Alternativa 2 e cea plauzibilă → schimbarea propusă: șterge „si apoi apasa Ctrl+A”, corectează „un singur element”.

**C. „Nu încape în 50 de minute”**
- Alternativa 1: elevii nu citesc atomii, profesorul îi predă în 10 minute la proiector.
- Alternativa 2: ritmurile provizorii ale porții sunt prea lente pentru clasa a VII-a.
- Observația, făcută (`u12_sensibilitate.txt`): fără citire, doar sarcina (Word + răspunsuri) = 51,3 min; la ritm dublu întreaga lecție = 50,2. Ambele alternative lasă ora la limită; de aceea `important`, nu `blocant`, iar reparația e tăierea răspunsurilor scrise și a atomilor 5-9 din ora 7.
