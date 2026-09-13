# Plan reparatie — cls8 / lectia4-functii (13.09.2026)

Surse: `F_evaluari/cls8/lectia4-functii/05_evaluare.md`, `log.json` (11 semnalari), `04_mediu.md`, `Q_verdict_blocante.json` (cls8-l4-01 = important, adevarat), `M_rezultat.csv` (9 randuri), `K_rezultat.csv` (3 randuri, toate „ok”). P_hibrid / O_orb: nimic pe lectia aceasta.
Verificare de fond: `constructie/construieste.py` -> `H_randeaza.py xlsx` -> `constructie/rezultat_recalcul.txt` (LibreOffice).

| id | Ce | Decizie | Motiv / cum |
|:--|:--|:--|:--|
| cls8-l4-01 | Atom 8: „B7 din 4 in 10”, „aveam deja un 10 in B4” | **aplic** | B8 (nota 4) si B5 (nota 10) in titlu, paragraf, intrebare, tabel; recalcul foaia `atom8_B8_10`: MIN 5, MAX 10, AVG 8, COUNT 8 |
| cls8-l4-02 | Incearca pas 6: „nota din B4 din 10 in 3” | **aplic** | B5 + punct de verificare: minim 3, maxim 9, media 6,375; recalcul foaia `pas6_B5_3` |
| cls8-l4-03 | Lectia = 2 ore din plan | sar | decizie de structura (spargere in doua ore) — ramane la profesor |
| cls8-l4-04 | Separatorul la formulele cu mai multe argumente | **aplic** | caseta din conventia 2 o singura data, in atomul 3, inainte de `=MIN(B2; B5; B8)` (prima formula cu mai multe argumente); IF in atomul 9 cu ambele forme (sintaxa, exemplu, titlu, nota de subsol, proba, intrebare) |
| cls8-l4-05 | Bonus COUNT/COUNTA fara diferenta | **aplic** | „scrie absent in B9”; recalcul: gol -> COUNT 7 / COUNTA 7 (vechi), absent -> COUNT 7 / COUNTA 8 (nou); indiciul completat |
| cls8-l4-06 | „Function Wizard” / „Asistentul de functii” | **aplic** | glosar CONFIRMAT: „Inserare funcție (Insert Function)”; si „Completare automată formulă (Formula AutoComplete)” |
| cls8-l4-07 | Zecimale cu punct | **aplic** | 7,25 / 20,71 / 60,43 / 4,8 / 12,5 cu virgula, „(sau 7.25, dupa calculator)” o data; Ex. 2: pana rotunjesti vezi 20,714286 |
| cls8-l4-08 | „Home -> Number -> creste/scade zecimale” | **aplic** | glosar: Pornire (Home), Mărire zecimală / Micșorare zecimală (Increase/Decrease Decimal); grupul „Number” nu e in glosar -> nu il numesc; nota format ≠ valoare (recalcul: E4 = 20,7142857, =ROUND(E4,2) = 20,71) |
| cls8-l4-09 | Intrebari decalate (atom 3 intreaba AVERAGE, atom 4 intreaba MAX); atomul fx fara intrebare; corecta cea mai lunga | **aplic** | schimb intrebarile atomilor 3 si 4; atomul 6 primeste a doua intrebare despre butonul fx; variantele intrebarii AVERAGE-goale scurtate la lungimi apropiate |
| M idx1, idx2 | intrebarile atomilor 1-2 marcate „decalat_inainte” | sar | falsa alarma: structura `=FUNCTIE(...)` e aratata in atomul 1, iar MIN (cea mai mica nota) e folosit in Incearca pas 2, inainte de atomi |
| M idx6 | intrebarea AVERAGE-goale in atomul 6 („altul”, best 4) | sar (partial) | se poate raspunde din atomul 4, care e inainte -> nu incalca regula 6; o pastrez, adaug intrebarea despre fx |
| cls8-l4-10 | Fara diacritice | sar | val separat (conventia 5) |
| cls8-l4-11 | Card modul / titlu vs continut, 9 atomi | sar | depinde de spargerea lectiei (l4-03), <title> si index-urile nu se ating |
| nou-salvare | Ex. 1 si Ex. 2 produc fisier fara nume/loc | **aplic** | conventia 3: `8A_Popescu_Note.xlsx`, `8A_Popescu_Meteo.xlsx` in folderul clasei |
| nou-average-ro | „In Excel international se foloseste AVERAGE” | **aplic** | 04_mediu: nu exista Excel „romanesc” cu MEDIA; glosar: numele functiilor nu se traduc |

Nota: textul casetei din conventia 2 e scris fara diacritice (stilul fisierului, conventia 5); numele din glosar pastreaza diacriticele.
