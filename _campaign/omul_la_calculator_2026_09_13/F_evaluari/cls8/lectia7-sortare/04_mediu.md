# 04 — Mediul presupus de lecție (U4)

## Ce presupune lecția
- **Program:** Microsoft Excel desktop pentru Windows („Deschide Excel”, „Ribbon”, „fila Data”). Nici Excel pentru web, nici LibreOffice Calc nu sunt menționate.
- **Limba interfeței:** engleză, fără traducere în paranteză: „Data”, „Sort & Filter”, „Sort”, „Add Level”, „Sort by / Then by”, „A to Z”, „Largest to Smallest”, „Expand the selection”, „Custom List”, „Home, grupul Editing”.
- **Separator / funcții:** lecția nu are formule de tastat (singura formulă, `=B2*C2`, apare în „De ce crezi tu” și nu are separator). R3.5 nu se aplică aici.
- **Setarea regională:** nicio mențiune, deși ordinea alfabetică depinde de ea (mai jos).
- **Versiune:** nedeclarată.

## Ce se știe (text brut, Microsoft Support, descărcat cu curl 13.09.2026)
| Lecția scrie | en-us (surse/sort_en.txt) | ro-ro (surse/sort_ro.txt) |
|:--|:--|:--|
| fila Data, grupul Sort & Filter | „On the Data tab, in the Sort & Filter group” | „Pe fila Date , în grupul Sortare și filtrare” (3×) **și** „Sortare & filtrare” (5×) — traducere inconsecventă chiar la Microsoft |
| butonul Sort, dialogul Sort | „select Sort” | „selectați Sortare . În caseta de dialog Sortare” |
| Add Level, Then by | „select Add Level” | „selectați Adăugare nivel”, caseta „Apoi după” |
| A to Z / Largest to Smallest | „A to Z”, „Largest to Smallest” | „De la A la Z”, „De la cel mai mare la cel mai mic” |
| Expand the selection | „press the Expand the selection option, otherwise select Continue with the current selection” | „apăsați opțiunea Extindeți selecția . Altfel, selectați Continuați cu selecția curentă” |
| Custom List | „select Custom List” | „selectați Listă particularizată” |
| „Excel le recunoaste ca antet … Antetul ramane mereu pe primul rand” | „By default, the value in the heading is not included … Occasionally, you may need to turn the heading on or off” / „My data has headers” | „Datele mele au anteturi” |
| Ctrl+Z după salvare nu mai ajută (Ex. 3, criteriul 4) | „You can undo changes, even after you have saved” (surse/undo_en.txt) | „chiar și după ce ați salvat” (surse/undo_ro.txt) |

Ce vede elevul pe ecranul din laborator **nu** se află din documentație — doar din sala 1 TIC.

## Ordinea alfabetică a numelor românești (Ș, Ț, Ă, Î)
- **Sursa (text brut):** „Sort orders vary by locale setting. Make sure that you have the proper locale setting in Regional Settings …” / ro-ro: „Ordinea de sortare variază în funcție de setarea regională” (surse/sort_en.txt, surse/sort_ro.txt).
- **Observat (u4_colatie.py → u4_colatie.json), colația Windows, nu Excel:**
  - ro-RO: `Sandu, Suciu, Szabo, Şerban, Șerban, Ștefan, Toma, Tudor, Țăranu, Țurcanu, Zamfir`; `Iordache` înainte de `Îndrieș`; `Ş` (sedilă) = `Ș` (virgulă) la comparare.
  - en-US: `Sandu, Şerban, Șerban, Ștefan, Suciu, Szabo, Țăranu, Toma, Tudor, Țurcanu`; `Îndrieș` înainte de `Iordache`; sedila ≠ virgula.
  - sortare naivă pe coduri Unicode (cum ar sorta un script fără setare regională): `Î, Ă, Ș, Ț` ajung **după Z**.
- **NESIGUR:** că Excel folosește exact colația Windows arătată aici — Microsoft spune doar că ordinea „variază în funcție de setarea regională”; Excel nu a fost pornit (interdicție). Pe un calculator cu Windows în engleză (en-US), un catalog cu Ștefan și Suciu iese altfel decât în ordinea din catalogul școlii.
- **Lecția nu atinge subiectul:** toate numele (Maria, Andrei, Elena, Bogdan, Carla, Dan) sunt fără diacritice, exact cazul în care diferența nu se vede.

## Setarea regională în laborator
Necunoscută → orice semnalare pe ordinea alfabetică sau pe numele comenzilor are `depinde_de_necunoscut: true`. Office-ul lui Vasile (ProPlus 2021, en-us) nu spune nimic despre laborator.

## LibreOffice
Numele comenzilor de sortare în LibreOffice în română: **NEVERIFICAT** (fără sursă brută descărcată). Randările din `recalculat/` probează doar conținutul fișierelor.
