# Plan reparatie — cls6 / m1-prezentari / lectia2-slide-uri

Surse citite: S_CONVENTII.md, GLOSAR_UI.md (PowerPoint + Office + variante), F_evaluari/cls6/lectia2-slide-uri/05_evaluare.md + log.json (12 findings) + 04_mediu.md + surse/raw (fundal, coordonator, dublare, teme), Q_verdict_blocante.json (cls6-l2-01 -> „adevarat_dar_important”), M_rezultat.csv (randurile lectiei). P_hibrid / O_orb: nu exista pentru lectie. K_rezultat.csv: toate randurile lectiei „ok” (nimic de reparat).

| id | ce | decizie | motiv / cum |
|:--|:--|:--|:--|
| cls6-l2-02 | intrebari decalate cu un pas (1 din 10 la pasul ei) | **aplic** | regula 6: mut fiecare intrebare la atomul care o preda: Ctrl+M -> 1; Title Slide + Comparison -> 2; stergere + dublare -> 3; reordonare -> 4; Slide Master -> 5; teme -> 6; gradient + Formatare fundal -> 7. Construit cu `s_quiz_nou.py` (lungimi R1.1, indicii fara litera). |
| cls6-l2-03 | nivel standard = Slide Master declarat optional | **aplic** (eticheta + o fraza) | Ex.2 devine „Nivel performanta, optional” cu fraza ca Slide Master nu e cerut la minim/standard. Un exercitiu standard NOU (aspecte+dublare+reordonare) = decizie de structura -> la profesor. |
| cls6-l2-05 | comenzi doar in engleza | **aplic** | „Romana (English)” din tabelul CONFIRMAT: Diapozitiv nou, Dublare diapozitiv, Ștergere diapozitiv, Coordonator de diapozitive, Închidere vizualizare coordonator, Formatare fundal, Umplere solidă/gradient/model, Antet și subsol, Subsol, Sortare diapozitive, Titlu / Titlu și conținut, Proiectare, Inserare, Pornire, Vizualizare (confirmat in glosar la Word + textul brut PowerPoint ro-ro `raw/master_ro.txt`), Se aplică tuturor/Se aplică pentru toate (VARIANTE -> ambele). Nume nevalidate (Two Content, Comparison, Title Only, Picture with Caption, Blank, Text Box, Slide Number, Colors/Fonts, Picture or Texture Fill) -> raman in engleza + nota convenției 1. Temele: nota ca au nume traduse (Basis = Bază, Integral = Integrală, `surse/s_teme.txt`). |
| cls6-l2-08 | „poza ta preferata” fara sursa; imagini fara sursa | **aplic** (date_personale) | imagine care arata pasiunea (obiect, loc, desen), nu poza cu tine sau colegii; de unde: folderul de imagini aratat de profesor. Dosarul fizic „Imagini_ora4” = actiune a profesorului -> sar partea asta. |
| salvare (nou) | Ex.1-Ex.4 + provocarea nu spun nume + loc | **aplic** | convenția 3: Clasa_Nume_<tema>.pptx / .docx in folderul clasei. |
| cls6-l2-09 | Ctrl+D ca metoda de dublare a diapozitivului | **aplic** (sfat_depasit) | drumul principal click dreapta -> Dublare diapozitiv; scurtatura Ctrl+Shift+D (`surse/s_dublare.txt`, scurtaturi ro-ro: „Faceți o copie a diapozitivului selectat. Ctrl+Shift+D”), cu nota ca pe miniatura selectata merge in unele versiuni si Ctrl+D. |
| cls6-l2-10 | panoul din stanga numit „Slide Sorter” | **aplic** | „panoul de miniaturi din stanga” (`surse/s_panou_miniaturi.txt`). |
| cls6-l2-11 | gradient-model aproape invizibil | **aplic** | capete #dbeafe -> #1e3a8a + verificare cu F5; contrastul recalculat (WCAG) inainte/dupa. |
| cls6-l2-12 | „5 metode diferite” cand se arata 3 | **aplic** | „Adauga 3 slide-uri noi, fiecare altfel: ...”. |
| cls6-l2-06 (partea gradient web) | PowerPoint pentru web nu are gradient pe fundal | **aplic** o fraza in Ex.1 | sursa `surse/raw/fundal_en.txt`: „PowerPoint for the web doesn't support gradient fills for slide backgrounds”. Fisa A4 pentru Izvoare = **sar** (varianta pe hartie, decizie profesor). |
| cls6-l2-01 | lectia nu incape intr-o ora | **sar** | decizie de structura (spargere / ora 4-5); Q: important, depinde daca L2 ia orele 4-5. |
| cls6-l2-04 | ora 4 cere obiectele (caseta, imagine, forma); repetitie cu L1 | **sar** | atom nou / aliniere cu lectia 1 = structura. |
| cls6-l2-07 | diacritice | **sar** | val separat (convenția 5). |
| K_rezultat | 4 randuri, toate „ok” | **sar** | nu e semnalare. |
