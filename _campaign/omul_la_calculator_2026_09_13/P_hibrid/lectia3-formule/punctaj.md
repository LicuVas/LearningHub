# Punctaj hibrid v3 — lecția 3 „Formule” (TIC, clasa a VIII-a)

Adevărul: 23 de probleme adevărate din `judecata.json` + 2 ratate de amândouă (A1, A2) = **25**. Scor: da = 1, parțial = 0,5.

## Recall

| Evaluare | Total | Importante + blocante (9) | Schimbă ora (7) |
|---|---|---|---|
| **Hibrid v3** | **0.68** (17/25) | 1.00 | 1.00 |
| v2 „om la calculator” (Y) | 0.48 (12/25) | 1.00 | 1.00 |
| Control „AI obișnuit” (X) | 0.88 (22/25) | 1.00 | 1.00 |

Hibrid: **0 false**, **4 adevărate noi** (S2, S9, S15, S17), 2 neverificabile (S20, S21).

## Potriviri

| Adevăr | Gravitate | Schimbă ora | Hibrid | Semnalare |
|---|---|---|---|---|
| P1 total 78 în loc de 77 | blocant | da | da | S1 |
| P2 întrebări decalate față de atomi | important | da | da | S11 |
| P3 SUM folosit, nepredat; e ora 8 | important | da | da | S6 (+S11) |
| P4 „nu de la stânga la dreapta” | important | da | da | S4 |
| P5 ciclul F4 | minor | nu | da | S12 |
| P6 TVA 19% în loc de 21% | important | da | da | S8 |
| P7 zecimale cu punct | important | da | da | S13 |
| P8 afișare 9.00 / 7 / 9.67 | minor | nu | da | S19 |
| P10 Ex.2 fără $: #VALUE! + numere greșite | important | nu | da | S5 |
| P11 lipsesc erorile tipice | minor | nu | nu | — |
| P12 obiective lipite din titluri | minor | nu | da | S16 |
| P13 bara de formule neexplicată | minor | nu | nu | — |
| P14 nicio captură de ecran | minor | nu | nu | — |
| P15 spații lipsă în întrebări | minor | nu | da | S18 |
| P16 „Corect!” sub „Incorect.” | minor | nu | da | S3 |
| P17 numerotare dezordonată | minor | nu | da | S18 |
| P18 Kill_Points / Ruler / „Cu calculatorul” | minor | nu | parțial | S18+S16 (lipsește Kill_Points) |
| P19 aplicațiile din programă | minor | nu | nu | — |
| P20 cont Microsoft + secțiuni imbricate | minor | nu | parțial | S10 (fără structura HTML) |
| P22 depășește ora 7 | important | da | da | S6+S7 |
| P23 fără diacritice | important | nu | da | S14 |
| P24 „Următoarea lecție” generică | minor | nu | nu | — |
| P25 termenul „drag handle” | minor | nu | nu | — |
| A1 indiciul de la atomul 7 („celule goale”) | minor | nu | nu | — |
| A2 misiunea anunțată „5 minute” | minor | nu | da | S7 |

## Semnalări noi ale hibridului (verificate independent)

| Id | Verdict | Gravitate | Dovada pe scurt |
|---|---|---|---|
| S2 grilele-foaie se afișează celulă sub celulă | adevărat nou | important | Playwright: antetele A–F au același `left=314`, `top` crescător din 37 în 37 px, grila are 1479 px; `.excel-row` nu are nicio regulă CSS |
| S9 răspunsurile se salvează pe calculator, nu pe elev | adevărat nou | important | cheia `practice-<lecție>` fără profil; textul revine la reîncărcare; orice text = `correct:1` |
| S15 „Format Cells” doar în engleză | adevărat nou | minor | Microsoft ro-ro scrie „Formatare celule...” |
| S17 mesaj „Răspunde corect…” fals | adevărat nou | minor | răspunsul greșit deblochează atomul 2; nota exactă (2 vs 1) depinde dacă e salvat și un exercițiu |
| S20 mânerul „pătrat negru” | neverificabil | minor | depinde de versiunea Office |
| S21 F4 cu Fn / în Excel Online | neverificabil | minor | depinde de echipament |

## Concluzie

1. Pe tot ce contează pentru oră (importante, blocante, schimbă ora) toate trei evaluările prind totul (1.00); diferența e doar la minore.
2. Hibridul urcă mult față de v2 (0.68 vs 0.48) fără nicio semnalare falsă și aduce 4 probleme reale pe care nu le-a văzut nimeni, dintre care două importante (grilele stricate, salvarea comună pe calculator).
3. Controlul X rămâne mai complet la mărunțișuri (0.88), iar hibridul ratează mai ales lipsuri de conținut (erori tipice, bara de formule, capturi, programa, „drag handle”, indiciul de la atomul 7).
