# Revizuirea completă a LearningHub — decizia și prima probă

**Data:** 27.09.2026
**Decizia lui Vasile:** situl se reface cu o revizuire COMPLETĂ. Pornim DUPĂ ce consola care lucrează acum la secțiunea /jocuri/ termină. Ce anume facem și cum facem se stabilește atunci, împreună cu el.

## Proba care a declanșat decizia
Lecția: `content/tic/cls8/m2-formule-functii/lectia1-introducere-formule.html`
(live: proba.learninghub-8z6.pages.dev/content/tic/cls8/m2-formule-functii/lectia1-introducere-formule)

Vasile a urmat instrucțiunile ca un elev, în Google Sheets cu setări românești. Captura lui: `C:\Users\licuv\Pictures\Screenshots\2026-09\chrome_XMusWkZo9P.png`
- A pus, firesc, denumirile pe rândul 1 și numerele pe rândul 2. Formulele din lecție (`=A1*B1`) se referă la rândul 1, deci pe foaia lui dau #VALUE!. Lecția nu îl avertizează.
- Butonul „Copiaza” a copiat textul explicativ („✏ Date de intrare (pune in A1:D1):”), care a ajuns în foaie pe coloana I.

## Ce am găsit citind lecția ca elevul (doar textul vizibil)
1. Pasul 1 scrie „A1 = Cantitate: 5”, iar elevul tastează text în celulă și obține #VALUE!.
2. Rezultatele sunt scrise cu punct („642.6”), dar pe setări RO apare 642,6. `=IF(..., ..., ...)` cu virgule nu merge în Excel RO (acolo e DACĂ cu ;). Lipsesc numele RO (SUMA, DACĂ, Formule, Urmărire precedenți). Regula STANDING: Office RO sau EN, deci ambele variante.
3. D1 are două roluri: e TVA la început, iar la Concept 5 devine „D1 (result) 540”.
4. Mini-factura promite „protecție #DIV/0! dacă cantitatea e 0”, deși formula nu împarte la nimic.
5. Exercițiul 2 spune „fiecare formulă are o eroare”, dar formula 5 nu are. La formula 1, Excel nu dă cod #, ci o fereastră de corectură. Remedierea e „0” în tabel și „N/A” în indiciu.
6. Exercițiul 1 cere 6 coloane în enunț, iar rezolvarea are 5.
7. Concept 2 spune „nu de la stânga la dreapta!” și, mai jos, „de la stânga la dreapta”.
8. TVA 19% e învechit (21% din 01.08.2025, după cunoștințele mele, nereverificat pe sursă).
9. Obiectivul promite „de la zero”, dar prima sarcină e o formulă cu 4 celule, discount și TVA, înainte să fie explicat semnul „=”.

## Lecția de fond (de ce n-au prins-o porțile)
Porțile și recenzenții au verificat FORMA (secțiuni, format C, rezolvări prezente), nu au URMAT instrucțiunile într-o foaie reală ca un elev. Proba adevărată este: execută pașii literal, în Sheets/Excel RO, cu așezarea firească pe care o alege un om, și compară ce vezi cu ce promite lecția.

## Cifre
- 841 de fișiere HTML sub `content/` (gimnaziu, liceu, profesional, tic), fără fișierele .bak.
