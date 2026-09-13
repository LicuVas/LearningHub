# Verificare reparatie — cls8 / m1-excel-fundamente / lectia7-sortare (runda 2)

**Verdict: trece** · 41 schimbari verificate · S_poarta.py: OK · HTML: 0 erori de etichete

| # | Defect din runda 1 | Acum | Dovada |
|:--|:--|:--|:--|
| 1 | important: „Dan are tot 10?” nu prindea sortarea crescatoare doar pe B | „Maria are tot 8? Elena are tot 9?” | verif\v2.py: crescator Maria 5/Elena 7, descrescator Maria 10/Elena 8 — prinde in ambele |
| 2 | minor: „Data”/„Sort” ramase in engleza | „Date”, „Sortare (Sort)”, „Adăugare nivel (Add Level)” in tabla de bord, Ex.2, Ex.3, rezumat | diff2.txt, grep pe fisierul nou |
| 3 | minor: Sort Ascending/Descending fara nota | nota „in Office in romana, butonul cu aceeasi pictograma” o data in tabel | diff2.txt linia 40 |

Concluzie: toate cele 3 defecte sunt reparate, iar controlul nou l-am construit pe ambele sortari gresite si le prinde.
Runda 2 a atins in plus rezolvarea Ex.1 si caseta „Vrei mai mult?” (Data/Sort -> Date/Sortare), corect si din glosar.
Raman in engleza doar titlul atomului 2 si „Custom List” (preexistente, fara gravitate).
