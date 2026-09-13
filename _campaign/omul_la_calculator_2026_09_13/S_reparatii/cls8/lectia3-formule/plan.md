# Plan reparatie — cls8 / lectia3-formule (13.09.2026)

Surse citite: S_CONVENTII, GLOSAR_UI (Excel), F_evaluari 05_evaluare + log.json + 04_mediu, Q_verdict_blocante (cls8-l3-01 = minor), P_hibrid semnalari S1-S21, O_orb judecata P1-P25, M_rezultat (atomi 2, 3, 5 decalati), K_rezultat (3x ok).
Cifre reconstruite: `construieste.py` -> `verificare.xlsx` -> `H_randeaza.py xlsx` -> `recalculat/verificare.xlsx`.

| Semnalare | Decizie | Cum |
|:--|:--|:--|
| cls8-l3-01 / S1 / P1 — indiciul 78 | APLIC | 78 -> 77 (LibreOffice: E5 =SUM(E2:E4) = 77) |
| cls8-l3-02 / S5 / P10 — „celule goale” la Ex.2 | APLIC | foaia ex2_fara_dolar: C4 #VALUE!, C5 1575, C6 1800, C7 700, C8 #VALUE! |
| O_orb „ce_au_ratat_amandoua” — indiciul atomului 7 („celule goale”) | APLIC | foaia tva_fara_dolar: C3 = 15, C4 = 24 (preturi, nu cota) |
| cls8-l3-03 / S8 / P6 — TVA 19% | APLIC | 21% in grila, intrebare, Deschidere (Legea 141/2025 art. 291, surse/tva_L141_2025.txt) |
| cls8-l3-05 / S4 / P4 — „nu calculeaza de la stanga la dreapta” | APLIC | regula corecta (surse/operatori_ro.txt); =10-3+2 = 9 recalculat |
| cls8-l3-06 / S13 / S19 / P7 / P8 — zecimale cu punct | APLIC | 7,5 (sau 7.5, dupa calculator), 9 / 9,67, 18,67; intrebarea atomului 3 fara zecimale |
| cls8-l3-08 / S12 / P5 — F4 | APLIC | ciclul B1 -> $B$1 -> B$1 -> $B1 -> B1 (surse/referinte_ro.txt, 4 tipuri) |
| cls8-l3-04 / P25 — „drag handle” | APLIC | „instrumentul de umplere (fill handle)” (glosar CONFIRMAT) |
| S15 — Format Cells | APLIC | „Formatare celule (Format Cells)” (glosar CONFIRMAT); „General” lasat asa (nu e in glosar) |
| S20 — „patrat mic negru” | APLIC | „patratelul din coltul din dreapta-jos” (fara culoare) |
| cls8-l3-09 / S11 / P2 / M — intrebari decalate | APLIC | atom 2: intrebare noua pe operatori; atom 4: copierea E2->E5 (fara SUM); atom 5: intrebare noua =20-8/2 |
| S3 / P16 — indicii cu „Corect!/Exact!” sub „Incorect” | APLIC | scos prefixul la toate indiciile |
| S18 / P18 (partial) — „Ruler”, spatii lipsa in intrebari | APLIC | „Rigla”; spatiile se rezolva prin rescrierea intrebarilor 2/4/5 |
| S16 / P18 (partial) — „Cu calculatorul?” | APLIC | „Cu calculatorul de buzunar?” |
| Conventia 3 — salvare | APLIC | Ex.1 si Ex.2: nume + loc |
| S2 — grilele desenate nu arata ca tabel | SAR | CSS / structura comuna (lesson-atomic.css), nu fisierul lectiei |
| cls8-l3-07 / S6 / S7 / P3 / P22 — ora prea plina, SUM la ora 8 | SAR | decizie de structura (ce se muta la ora 8) — profesorul |
| cls8-l3-10 / S14 / P23 — diacritice | SAR | val separat |
| S9 — raspunsuri salvate in browser | SAR | motorul JS |
| S10 / P20 — varianta pe hartie, cont Excel Online | SAR | varianta pe hartie = structura |
| S17 — mesaj de blocare / nota automata | SAR | motorul JS |
| S21 — Fn+F4 | SAR | neverificat (fara echipament) |
| S16 / P12 — obiective/rezumat lipite din titluri; P17 numerotare atomi | SAR | structura obiectivelor si titlurilor atomilor, legate intre ele — profesorul |
| P11 caseta de erori; P13 bara de formule; P14 capturi; P19 exemple din programa; P24 lectia urmatoare | SAR | continut nou / imagini = structura |
| S19 partial — tabelul formulelor fara C5, D5; E2 SUM vs B2+C2+D2 | SAR | minor, judecatorul l-a gasit slab; nu schimba nicio cifra |
| Caseta separator ; / , | SAR | lectia nu are formula cu mai multe argumente (doar intervale); zecimalele primesc nota scurta |
| P9 nume functii traduse; P21 butonul Inapoi | SAR | verdict „fals” |
