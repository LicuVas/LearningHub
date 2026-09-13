# 03 — Jurnalul sarcinii (U1, U11) · lectia4-liste

## Constrângerile elevului pe care îl joc (U11)
- 13 ani, clasa a VII-a, a făcut lecțiile 1-3 (Word) în septembrie-octombrie; nu a folosit niciodată lista multinivel sau „Define New Number Format”.
- Nu știe engleză suficient cât să traducă „Numbering” → „Numerotare”; dacă Word-ul din laborator e în română, caută „Bullets” și nu-l găsește (numele românești confirmate: Marcatori / Listă cu marcatori, Numerotare / Listă numerotată, Definire format nou de numerotare — `surse/s01`, `s02`).
- Nu vede rezolvarea când lucrează (e pliată „Vezi rezolvarea”); vede enunțul și atomii citiți înainte.
- Are 50 de minute din care ~8 se duc pe pornire; ora 7 din plan (20/23.10.2026) are titlul „Formatarea imaginii, a tabelului și a paginii”.
- Nu știe că documentul trebuie salvat și unde: lecția nu spune (u_anexa_grep.txt: „salv” apare doar în exemplul de listă și la casetele site-ului).

## Pașii, cum i-am făcut (python-docx, liste REALE din numbering.xml, randate cu LibreOffice)
1. **Ex.1** — titlu Bold 16 (de mână, cum cere lecția), 3 categorii cu marcator, produse pe nivelul 2. Randat: nivelul 2 începe mai la dreapta, cu cerc gol. Fără probleme; singurul loc unde un începător se poate încurca e ordinea: rezolvarea spune „scrie cele 3 categorii, selectează-le, Bullets”, apoi „sub fiecare categorie scrie produsele” — cine scrie întâi categoriile trebuie să se întoarcă cu cursorul la finalul lui „Fructe” și să apese Enter.
2. **Ex.2** — Ingrediente cu marcatori, Mod de preparare numerotat, sub-pași a/b cu Tab la pașii 2 și 4. Randat: 1., 2., a., b., 3., 4., a., b., 5. — numerotarea principală continuă corect, literele repornesc. Enunțul întreabă însă „Cum ai făcut trecerea de la lista numerotată la cea cu marcatori?” — în enunț ordinea e invers (marcatori → numerotare); elevul literal nu știe ce să răspundă.
3. **Ex.3 — aici se strică.** Enunțul cere reguli cu I, II, III și sub-puncte **cu marcatori**. Rezolvarea spune: „scrie sub-punctele și apasă Tab - acestea trec automat pe marcatori (nivel 2)”. Dar aceeași lecție, la Ex.2, spune că Tab într-o listă numerotată „schimbă automat numerotarea în litere (a, b, c)”, iar atomul 4 arată 1. / a. / i. Am făcut ambele variante: `Tema_Liste.docx` (ce cere enunțul: I. + •) și `Ex3_dupa_rezolvare_Tab.docx` (ce prezice lecția la Ex.2: I. + a., b.). Pe hârtie se văd diferit (`randat_docx/Tema_Liste_p3.png` vs `Ex3_dupa_rezolvare_Tab_p1.png`). Pentru varianta cerută am avut nevoie de un nivel 2 cu marcator — pasul care face asta (selectezi un marcator de nivel 2 și alegi Marcatori, Microsoft: formatarea „un nivel pe rând”, `surse/s07`) **nu e predat nicăieri**. Ce face exact Word-ul din laborator după Tab nu se află din documentație (`03_pasi.json` pas 9, `gasit: neclar`).
4. **Selectarea listei (atomul 9)** — lecția: clic pe marcator = un singur element; clic pe marcator + Ctrl+A = toată lista. Microsoft (text brut): clic pe un marcator selectează **toți** marcatorii listei; Ctrl+A = „Selectați tot conținutul documentului”. Un elev care, la Ex.3, face clic pe un marcator + Ctrl+A și apoi apasă Numerotare transformă în listă și titlul „Regulamentul clasei”.
5. **Răspunsurile scrise** — 3 casete; placeholderul cere „toate cele 4 intrebari” la Ex.2, care are 2 întrebări (captura `dupa_atomi_03.png`; numără pașii enunțului, nu întrebările).
6. **Provocarea** — Continue Numbering: aceeași listă dă „Etapa 2” după paragraful intercalat; lista repornită dă „Etapa 1”. „De ce?” — verificat: ștergând pasul 2 dintr-o listă reală rămân 1, 2, 3; din „1. 2. 3.” tastat rămân 1, 3, 4 (`u3_iesire.json`). Afirmația lecției e corectă.

## Blocaje-ipoteză (AI, nu observate la copii — trec în anexă ca întrebare)
- Ex.3: după Tab apar „a., b.” în loc de marcatori → elevul crede că a greșit sau lasă așa.
- Căutarea butoanelor cu nume englezești pe un Word românesc.
- „Define New Number Format” — dialogul are 5 câmpuri; alegerea „I, II, III” se face dintr-o listă derulantă „Stil număr”.
- Ctrl+A după clic pe marcator → tot documentul numerotat.
- Documentul nesalvat se pierde la final de oră.
