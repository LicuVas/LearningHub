# Verificare reparatie — cls7 / lectia2-formatare-text

**Verdict: trece_cu_defecte_minore** · 32 de bucati din diff verificate · poarta S_poarta.py: OK · consola: goala

| # | Unde | Problema | Gravitate |
|:--|:--|:--|:--|
| 1 | Atom 6, dupa „Emboss, Engrave nu mai exista” | „Aceste efecte ... pot fi utile” pare sa se refere la efectele scoase din Word | minor |
| 2 | Atom 9, „Unformatted Text (... acelasi loc in lista)” | ordinea din lista depinde de ce ai copiat, deci reperul nu e sigur | minor |
| 3 | Atom 4/9, fontul implicit | Word 2024 nu este numit (Calibri 2021- / Aptos M365) | minor |
| 4 | Chestionarul 9, varianta c | distractor slab; „Îmbinare formatare” ar fi o greseala reala | minor |
| 5 | Atom 7, nota Advanced | „pot aparea tradus” (acord) + „tab-ul Advanced” ramas | minor |
| 6 | Atom 6, Lansatorul casetei de dialog Font | paranteze imbricate, greu de citit | minor |

Reproduse independent: Ex.3 cu Titlu 1 (PDF: 4 titluri recunoscute, fata de 0 in varianta manuala); Ctrl+Alt+V/Ctrl+Shift+V pe versiuni si chestionarul 9 (cheie corecta, JSON = HTML); Ctrl+Shift+Minus la indice; toate numele romanesti din tabelul CONFIRMAT.
Nedeclarate (inofensive): o fraza in atomul 9, „Culoarea fontului” in rezolvarea Ex.3, notele din afara glosarului (trecute doar in plan). „Lipire specială” are sursa bruta Microsoft, dar nu este in glosar.

Concluzie: reparatiile de fond sunt corecte si verificate pe surse. Nimic nu e stricat in HTML.
Cele 6 defecte sunt de formulare, nu de continut, si se repara in cateva minute.
Deciziile de structura (timpul, varianta fara calculator) au fost lasate corect profesorului.
