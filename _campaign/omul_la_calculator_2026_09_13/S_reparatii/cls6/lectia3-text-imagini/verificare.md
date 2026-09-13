# Verificare — cls6 / lectia3-text-imagini (13.09.2026)

**Verdict: trece_cu_defecte_minore** · 49 de schimbari verificate · 0 blocante · 0 importante · 4 minore

| Ce | Rezultat | Dovada |
|:--|:--|:--|
| 13 intrebari mutate/noi (14 total) | Toate la pasul care le preda, chei corecte, 10/10 pasi deblocati | verif/quiz_cmp.txt, verif/atom_text.txt, vede_dupa/parcurgere.json |
| Ctrl+Shift+] = Bring to Front | Neschimbat si corect | curl Microsoft en-us + s_prim_plan.txt (ro-ro) |
| Banner pe standardele 2026 | Citatul „casete text, forme predefinite” exista (VI, CS [0] si [6], De bază) | verif/curr.py pe curriculum.json |
| Justificarea bannerului pentru atomul 9 | Minor: Ex.1 nu foloseste aranjarea obiectelor | textul Ex.1 |
| „nivel extindere” in Ex.1 dupa redenumirea bannerului | Minor: termen ramas nedefinit | diff r.144 vs 198-204 |
| Lungimea variantei corecte (R1) | Minor: 4 intrebari peste 1,20x, nevizibil | quiz_cmp.txt |
| Stock Images: cale ramasa in engleza | Minor; sursa are „Bancă de imagini” | s_imagini_stoc.txt |
| Nume de comenzi + diacritice noi | Toate din glosarul CONFIRMAT | GLOSAR_UI.md, grep pe diff |
| Rezolvarea Ex.1 (pptx) | Reprodusa: 1 imagine/slide, <=6 randuri, >=18pt | verif/pptx_check.py |
| Poarta | OK (1/1 trec) | S_poarta.py |

Reparatiile de fond (intrebari la locul lor, date personale, salvare cu nume + loc, fundal si sursa imaginilor, nume din glosar) sunt corecte si reproduse.
Ce ramane sunt formulari: motivul bannerului pentru atomul 9, termenul „extindere” din Ex.1 si o cale ramasa in engleza.
Nimic stricat pe langa: HTML se parseaza, singura schimbare nedeclarata e „[prenumele tau]”, corecta.
