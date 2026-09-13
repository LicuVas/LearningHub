# 04 — Ce mediu presupune lecția (U4)

## Ce presupune lecția (din text)
| Aspect | Ce scrie lecția | Dovada |
|:--|:--|:--|
| Program | **Microsoft Excel** sau **Excel Online** („gratuit cu cont Microsoft”); o singură mențiune de Google Sheets (în pliantul Name Box); **LibreOffice: 0 mențiuni** | innerText.txt r. 60, 97-105 |
| Versiune | nedeclarată; butonul „+” de lângă file și panglica sunt Excel 2013+ / Microsoft 365 | atomul 9 |
| Limba interfeței | **engleză**: Home, Insert, Formulas, Data, Sheet1, Rename, Delete, Move or Copy, Name Box (19 apariții), Formula Bar (18), Ribbon, Workbook, Worksheet. Traducerea românească apare o singură dată pentru „Caseta Nume” și „Bara de formule” (atomii 6, 7) | numărătoare pe innerText.txt |
| Separator de argumente | o singură formulă cu separator, **în rezolvarea pliată a Ex. 2**: `=IF(B1=0,"N/A",A1/B1)` (virgulă). Restul formulelor n-au separator (`=SUM(B2:B6)`, `=AVERAGE(B2:D2)`) | innerText.txt r. 643 |
| Separator zecimal | **punct**: 8.67, 9.25, 8.25, 0.9, 254.7 — și, în aceeași lecție, **punctul ca separator de mii**: 16.384, 1.048.576 | innerText.txt r. 186-188, 398, 610 |
| Sistem de operare | Windows implicit (Ctrl+Home/End, clic dreapta) | — |
| Cont | Excel Online cere cont Microsoft | r. 60, 99 |

## Ce se știe despre laborator (B_context_real.md §3)
- Brauner, sala „1 (TIC)”: există laborator; **Office/LibreOffice, limba, setarea regională: NECUNOSCUTE**.
- Izvoare (clasa a VIII-a, marți 8:00): ipoteza de lucru = **fără laborator**.
- Office-ul de pe PC-ul lui Vasile e în engleză — nu spune nimic despre laborator.

## Numele din lecție verificate în Microsoft Support (text brut descărcat, 13.09.2026, `surse/`)
| Lecția | Excel în română (ro-ro) | Citat brut | Fișier |
|:--|:--|:--|:--|
| Home | Pornire | „selectați Pornire > Inserare > Foaie” | surse/foi_ro.txt |
| Insert (fila) | Inserare | „Faceți clic pe fila Inserare , selectați tipul de diagramă” | surse/grafic_ro.txt |
| Formulas | Formule | „Pe fila Formule , în grupul Nume definite” | surse/nume_formule_ro.txt |
| Data | Date | „Pe fila Date , în grupul Sortare și filtrare” | surse/sortare_ro.txt |
| Sheet1 | Foaie1 | „Excel denumește foile de lucru Foaie1, Foaie2, Foaie3” | surse/redenumire_ro.txt |
| Rename | Redenumire | „faceți clic dreapta pe selectorul Foaie , selectați Redenumire” | surse/foi_ro.txt |
| Delete | Ștergere | „Faceți clic dreapta pe un selector de Foaie și selectați Ștergere” | surse/foi_ro.txt |
| Move or Copy | Mutare sau copiere | „comanda Mutare sau copiere foaie” | surse/mutare_ro.txt |
| Name Box | caseta Nume | „Faceți clic pe caseta Nume din capătul din stânga al barei de formule” | surse/nume_formule_ro.txt |
| Ctrl+End | Ctrl+End | „Ctrl+End se deplasează la ultima celulă dintr-o foaie de lucru, la cel mai de jos rând utilizat al coloanei din extrema dreaptă” | surse/shortcuts_ro.txt |
| „nu poți da Undo” la ștergerea foii | — | paginile ro-ro/en-us despre ștergere **nu** spun nimic despre Undo | surse/foi_en.txt |

Fapte stabilite deja (13.09.2026, protocol): Excel în română **nu traduce numele funcțiilor** (SUM, AVERAGE sunt corecte); separatorul `;`/`,` depinde de setarea regională a Windows-ului din laborator — necunoscută.

## Ce înseamnă pentru oră
1. **Dacă laboratorul are Excel în română:** 6 dintre pașii elevului (Sheet1, Rename, tabelul cu file, Delete, Move or Copy, butonul „+” care dă „Foaie2”) folosesc nume care nu apar pe ecran. Schimbarea care acoperă ambele variante: „foaia **Foaie1 (Sheet1)**”, „**Redenumire (Rename)**”, „fila **Pornire (Home)**”.
2. **Dacă laboratorul are LibreOffice Calc:** lecția nu îl pomenește deloc; panglica, butonul „+”, „Name Box” au alte nume/aspect. NEVERIFICAT (nu am deschis LibreOffice în română).
3. **Separatorul zecimal:** lecția scrie 8.67 și 16.384 în aceeași pagină. Pe un Windows cu setare românească, Excel afișează 8,67. Exercițiile acestei lecții tastează doar numere întregi (note), deci **nu blochează ora 2**; devine important la lecția 2 (tipuri de date) și la formulele cu zecimale. `depinde_de_necunoscut: true`.
4. **Cont:** singura alternativă la Excel instalat e Excel Online cu cont Microsoft; un elev de 14 ani fără cont nu are plan B în lecție.
