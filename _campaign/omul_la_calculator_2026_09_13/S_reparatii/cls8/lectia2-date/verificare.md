# Verificare reparatie — cls8 / lectia2-date

**Verdict: trece cu defecte minore** · 20 de schimbari verificate · 0 blocante · 0 importante · 4 minore

| # | Unde | Problema | Gravitate |
|:--|:--|:--|:--|
| 1 | Atom 6, randul Number: „1.234,50” + „separator mii” | Number nu pune separator de mii implicit (greseala veche, pastrata) | minor |
| 2 | Ex. 2: „arata „3,50 lei”” | Pe setare in engleza arata $3.50; contrazice atomul 6 | minor |
| 3 | Rezolvarile Ex. 1 („grupul Alignment”) si Ex. 2 („Merge & Center”) | Nume ramase doar in engleza | minor |
| 4 | Atom 5, randul Center | Stil vechi cyan/ingrosat, iese in evidenta pe captura | minor |

Confirmate prin reproducere: scurtaturile Ctrl+L/E/R si Backspace (text brut Microsoft), factura 62,10 (recalculata), blocul cu Tab (5x4, 8 note numerice), rotirea chestionarelor (chei corecte, fiecare intrebare dupa pasul care o preda), bonusul cu rand inserat, 46037 = 15.01.2026. Poarta S_poarta.py: OK; consola fara erori.

Reparatiile de fond sunt corecte si nimic din lectie nu s-a stricat (etichete HTML echilibrate, JSON-ul chestionarelor valid).
Cele 6 schimbari nedeclarate sunt consecinte firesti ale reparatiilor (vezi verificare.json), niciuna daunatoare.
Cele 4 defecte minore se repara in cateva minute si nu blocheaza publicarea.
