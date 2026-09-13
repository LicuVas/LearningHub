# 04 — Mediul (U4)

## Ce presupune lecția
| Aspect | Ce scrie lecția | Ce se știe (sursă) | Consecință |
|:--|:--|:--|:--|
| Program | „Deschide Excel, Google Sheets” + linkuri Excel Online (cont Microsoft) și Google Sheets | laboratorul Brauner: dotare **necunoscută**; Izvoare: probabil fără calculatoare (`B_context_real.md` §3) | Încearcă depinde de program + eventual cont online |
| Limba interfeței | engleză: „Format Cells”, „drag handle”, „auto-fill”, „Ruler” | Microsoft ro-ro: „Formatare celule” (`surse/formate_numar_ro.txt`), „instrumentul de umplere”, „Umplere automată Opțiuni” (`surse/umplere_ro.txt`). „drag handle” nu apare nici în en-us, unde e „fill handle” (`surse/umplere_en.txt`) | numele din lecție nu e al Excel-ului în nicio limbă; în română elevul caută alt cuvânt |
| Nume de funcții | `SUM`, `AVERAGE` | Excel în română **nu traduce** numele funcțiilor (fapt stabilit 13.09.2026 pe text brut, protocol U4; `F_evaluari/cls8/lectia1-interfata/surse/nume_formule_ro.txt`) | `SUM` corect. LibreOffice în română: NEVERIFICAT |
| Separator de argumente | doar un argument (`SUM(B2:D2)`); distractorul `=SUM(B2,B6)` din atomul 4 | depinde de setarea regională Windows din laborator — **necunoscută**. Pe acest PC ro-RO: separator listă „;” (`u4_cultura.txt`) | distractorul cu virgulă e „greșit” din alt motiv pe ro-RO (virgula e zecimală) — explicația din indiciu rămâne valabilă doar pentru „interval vs două celule” |
| Separator zecimal | `=3.5*10`, „media 7.50”, „9.00”, „9.67”, „18.67” | ro-RO: zecimala „,” — `8.5` nu e număr (`u4_cultura.txt`); randarea LibreOffice pe ro-RO afișează `7,5`, `9,666667` | `depinde_de_necunoscut: true`: pe Windows în română, `=3.5*10` tastat de elev nu e un număr cu zecimale; scrie ambele variante |
| Scurtături | F4 (referințe), Shift+8 pentru `*`, Ctrl+C / Ctrl+V | F4 confirmat ro-ro și en-us (`surse/referinte_*.txt`): „Apăsați F4 pentru a comuta între tipurile de referință”; aceeași pagină arată 4 tipuri ($A$1, A$1, $A1, A1). Shift+8 = `*` pe tastatura US; pe layout-ul românesc din laborator: NEVERIFICAT | ciclul F4 din lecție („B1 → $B$1 → B1”) sare peste cele două mixte |
| Ordinea operațiilor | „Excel nu calculeaza de la stanga la dreapta” | Microsoft ro-ro: „Excel calculează formula de la stânga la dreapta, conform unei ordini specifice” (`surse/operatori_ro.txt`) | formularea lecției contrazice sursa |
| Fapt din lumea reală | TVA 19% | Legea 141/2025, art. 291 Cod fiscal: 21% din 01.08.2025 (`surse/tva_L141_2025.txt`) | exemplu depășit, de actualizat (poate fi generic: „cota din B1”) |

## Ce NU se poate afla de aici
- Versiunea de Office/LibreOffice din sala „1 (TIC)”, limba interfeței, setarea regională, dacă elevii au cont Microsoft/Google.
- Office-ul de pe PC-ul lui Vasile (ProPlus 2021 en-us) nu spune nimic despre laborator.
- Randarea LibreOffice probează conținutul (valori, format zecimal ro-RO), nu aspectul exact din Excel.
