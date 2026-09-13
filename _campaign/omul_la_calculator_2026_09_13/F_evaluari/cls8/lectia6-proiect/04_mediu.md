# 04 — Mediul (U4) — cls8 / lectia6-proiect

## Ce presupune lecția
- **Program:** „Deschide Microsoft Excel (sau Excel Online)”. Nicio mențiune de LibreOffice.
- **Limba interfeței:** engleză, fără traduceri: Merge & Center, Number, All Borders, Insert → Column Chart → 2-D Clustered Column, Page Layout → Orientation / Margins: Narrow, Header/Footer, Convert to Number, Fit to 1 page, Conditional Formatting.
- **Separator de argumente:** virgula, peste tot. **Verificat azi pe fișier (`u1_iesire.json`):** 26 de formule în `<code>`; **0** cu `;` după decodarea HTML, 6 cu virgulă (IF ×4 cu virgulă, COUNTIF, structura IF).
  `B_context_real.md` §4b spune „5 cu punct-virgulă ȘI 6 cu virgulă — amestecate”: cele 5 „punct-virgule” sunt `;` din entitatea `&gt;` (`>=`) din HTML-ul brut — **artefact de numărare, nu amestec real** (`04_a_doua_cale.json`, rândul „formule din <code> cu ';'”).
  Deci problema reală e alta: lecția dă **doar** virgula, fără nota pentru Windows în română.
- **Separator zecimal:** punct — „7.50” în blocul de lipit, „Notele ca numere (7.50)” la Ex. 3.
- **Nume de funcții:** SUM, AVERAGE, MIN, MAX, COUNT, IF, COUNTIF — corecte și pentru Excel în română (fapt stabilit la 13.09: Excel ro nu traduce funcțiile; `surse/countif_ro.txt` și `if_ro` au `=COUNTIF(A2:A5,"București")` în pagina ro-ro).

## Comparat cu ce se știe
| Element | Lecția | Sursă verificată (text brut) | Consecință |
|:--|:--|:--|:--|
| Îmbinare | Merge & Center | ro-ro: „Îmbinare & centru” (`surse/imbinare_ro.txt`) | numele nu există pe interfața română |
| Grafic | Insert → Column Chart → 2-D Clustered Column | ro-ro: „Selectați Inserați > diagrame recomandate” (`create_ro.txt`), „Coloană grupată” (`tipuri_ro.txt`) | idem |
| Margini | Page Layout → Margins: Narrow | ro-ro: „În fila Aspect pagină … Margini … Normal , Lat sau Îngust” (`margini_ro.txt`) | idem |
| Excel Online | oferit ca alternativă la pasul 1 | ro-ro: „Deși Excel pentru web nu acceptă setarea marginilor de pagină”; en-us: „Although Excel for the web doesn't support setting page margins” (`margini_*.txt`) | pasul 6 nu se poate face în varianta oferită |
| Antet de pagină | Insert → Header & Footer | ro-ro: „Accesați Inserare > antet & subsol” (`antet_ro.txt`) — în altă pagină aceeași documentație scrie „Inserați” | traducere inconsecventă chiar la Microsoft |
| Text → număr | „Convert to Number” | ro-ro: „Selectați Conversie în număr din meniu” (`text_numar_ro.txt`) | numele diferă |
| „7.50” pe Windows ro-RO | lipit ca număr | .NET pe acest PC (ro-RO): `TryParse '7.50' in ro-RO: numar=False` (`u4_cultura.txt`) | **ipoteză** pentru Excel: notele devin text → `#DIV/0!` (`recalculat/lipire_roRO_text.xlsx`) — `depinde_de_necunoscut` (setarea regională a laboratorului) |
| Axa graficului | nimic | LibreOffice pornește axa de la 7,35 pe mediile pe materii (`randat_xlsx/ex2_buletin_p1.png`); ro-ro: minimul axei se schimbă din „Minim” (`axa_ro.txt`) | ce alege Excel automat: **neverificat** (fără Excel pornit) |

## Ce nu se știe (laboratorul)
Versiunea Office/LibreOffice, limba interfeței, setarea regională Windows, cont Microsoft pentru elevi, dacă PC-urile se restaurează la repornire. PC-ul lui Vasile e ro-RO la setări regionale și Office en-us — nu spune nimic despre laborator.
La **Izvoare** ora 12 nu există în calendar (comasată: „conținutul trece la ora anterioară + temă acasă”, `Calendar_ore_VIII.md` r. 11-13), iar școala e presupusă fără laborator.

## Schimbarea propusă (acoperă ambele variante)
O casetă la începutul proiectului: „Dacă Excel e în română: Îmbinare & centru, Inserați → Coloană grupată, Aspect pagină → Margini → Îngust, Inserare → Antet & subsol. Dacă notele apar aliniate la stânga sau vezi #DIV/0!, înlocuiește punctul cu virgulă (Ctrl+H: . → ,). Dacă formula cu virgulă dă eroare, scrie `;` în loc de `,`.” Plus datele din bloc scrise fără zecimale (note întregi, cum sunt notele reale) — dispare și problema punctului.
