# 06 — Pre-mortem (U14) și explicații alternative (U13)

Schița scrisă după pasul 1 (ce promite lecția, fără să fi făcut sarcina); fiecare motiv completat după verificare.

## U14 — „Ora a eșuat. De ce?”

| # | Motivul (scris înainte) | Verificarea făcută | Rezultatul |
|--:|:--|:--|:--|
| 1 | Lecția e ținută în ora greșită: e despre sistemul de operare, dar stă în M1 | Am comparat cu `Calendar_ore_5AM_5M.md` (`surse/calendar_5AM_5M_extras.txt`) | **Confirmat.** Temele sunt orele 8, 9, 10 (și parțial 11) din M2, 06-27.11.2026. Într-o singură oră se înghesuie patru. |
| 2 | Copiii nu termină: citire + practică + 8 întrebări + 3 exerciții | Poarta calculează din `03_pasi.json` și `masuri.json` (3.112 cuvinte) | **Confirmat parțial:** ~86 min la ritm provizoriu, ~47 la ritm dublu → „important”, nu „blocant”. |
| 3 | Pașii din Explorer nu se potrivesc cu ecranul din laborator (Windows 11 / română) | Microsoft Support ro-ro și en-us, text brut (`surse/pas_meniu_contextual.txt`) | **Confirmat ca risc:** în Windows 11 Copy/Paste/Rename/Delete sunt pictograme fără text; în română se numesc Copiere/Lipire/Redenumire/Ștergere. Ce Windows rulează în sala 1 TIC = necunoscut. |
| 4 | Provocarea „Bonus” nu se poate duce la capăt cum e scrisă | Am făcut-o pe disc, pe toate ramurile (`u1_fisiere.py` → `u1_fisiere_iesire.json`) | **Confirmat:** mutarea dă peste fișierul cu același nume; în ordinea scrisă structura-țintă nu se obține (Înlocuire → Matematica goală; Omitere → fișierul rămâne în rădăcină). |
| 5 | Ce face o clasă se strică la clasa următoare (același PC, același cont) | Simulat pe disc (`u1_fisiere_iesire.json` → `a_doua_clasa_acelasi_pc`) | **Confirmat pe disc:** `Teme_cls5` există deja, cu fișierele primului elev. Dacă PC-urile se restaurează la repornire (atunci s-ar pierde totul) **nu se poate afla fără sală**, pentru că depinde de configurația laboratorului. |

## U13 — pentru fiecare semnalare gravă, altă explicație + observația care le deosebește

**A. „Rezolvarea Exercițiului 2 contrazice pasul 3” (antivirus).**
- Explicație alternativă: nu e o greșeală, ci o altă clasificare legitimă — unele manuale pun utilitarele ca subcategorie a software-ului de sistem; atunci ambele ar fi „corecte”.
- Observația care le deosebește: dacă lecția ar folosi clasificarea în două, pasul 3 n-ar spune „trei categorii mari” și n-ar pune antivirusul separat. Făcută (`u5_iesire.json` → `A_antivirus`): pasul 3 = „trei categorii mari”, antivirus în lista **Utilitar**, nu în lista de Sistem; cerința Ex. 2 dă doar două categorii; rezolvarea pune antivirusul la sistem. Deci e contradicție **în interiorul lecției**, oricare clasificare ar fi aleasă.

**B. „Bonus Challenge nu atinge structura-țintă”.**
- Explicație alternativă: autorul a vrut ca „copia de la pasul 6” să fie ștearsă *înainte* de mutare și ordinea propozițiilor e doar întâmplătoare; un copil atent ar face asta.
- Observația: am rulat și ordinea inversată — ea dă exact ținta (`ordinea_inversata_sterg_intai` → `egal_cu_tinta_din_lectie: true`). Deci ținta e posibilă, dar **textul nu spune ordinea**, iar ordinea în care e scris duce la dialogul de conflict. Semnalarea rămâne „important” (lecția trebuie să numeroteze pașii), nu „blocant”.

**C. „Lecția e în altă oră decât scrie planul”.**
- Explicație alternativă: planul s-ar putea schimba ca lecția de pe site să fie ora corectă (site-ul e cel „bun”).
- Observația: am citit programa (`curriculum.json`, CS.1.2) — operațiile cu fișiere și sistemul de operare sunt la CS.1.2, iar M1 din plan e CS.1.1. Planul respectă programa; site-ul nu. Nepotrivirea e a site-ului.

**D. „Calculatorul lent = de obicei hardware” e fals.**
- Explicație alternativă: pentru un PC școlar foarte vechi, chiar hardware-ul e cauza cea mai frecventă.
- Observația: Microsoft Support (text brut, `surse/fapte_2026.txt` pct. 3) listează spațiul de stocare, aplicațiile de la pornire și software-ul învechit **înainte** de hardware, iar malware-ul separat. Regula generală „de obicei hardware” nu e susținută; pentru PC-urile din sala 1 TIC nu am date.
