# 04 — Norma din afara lecției (U16) · cls6/lectia5-tranzitii

## Diacritice
- Măsurat pe `innerText.txt` cu formula porții: **1,2 la 1000 de litere** (text românesc normal ≈ 40-60). Lecția e scrisă fără diacritice, cu scăpări izolate: „deranjează”, „Navighează”, „Creează”, „Aplică”, „și”, „îți”, „trasă”, „aranjează”, „incepători”, „apeși”, „Debifează/Bifează”, „afișat” (Grep în `innerText.txt`).
- În HTML: 6 ș/ț cu **virgulă**, 0 cu sedilă (`u9_iesire.json`: `comma_s_t: 6`, `cedilla_s_t: 0`).
- `LESSON_SPECIFICATION.md:401`: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; checklistul `:751`: „Romanian text with proper diacritics (ă, â, î, ș, ț)”. Aceeași abatere ca la lecțiile 1-4, cu dovada proprie de mai sus.
- Limbă amestecată: Ex.3 are o frază pe jumătate în engleză — „Titlul apare cu animatie "Fly In" (From Bottom), then the subtitle with "Fade"”.

## Programa (OMEN 3393/2017 + standardele O. 4.615/2026, extras cu `u16_programa.py` → `u16_programa.txt`)
- Activitatea de învățare: „realizarea unei prezentări noi, pe o temă atractivă, aplicând efecte de animație obiectelor și de tranziție diapozitivelor și **expunerea prezentării**” (`clase.VI.competente_specifice[0].activitati_invatare[2]`). Lecția acoperă tranzițiile și expunerea (F5 / Shift+F5) — potrivit.
- Standardul: „…prin editare, formatări, expunere și **efecte de bază**”; descriptorul „De bază”: „cu sprijin … elemente simple … în pași ghidați”; abia „Avansat” are „**efecte predefinite**”.
- „Temporizare” apare la clasa a VI-a doar la **animațiile grafice** (`competente_specifice[1].descriptori.Consolidat/Avansat`), nu la prezentări. Ex.3 (6 timere diferite + Morph + 9 animații) și partea din atomul 4 despre kiosk/buclă sunt peste standardul de prezentări; eticheta „performanta” e corectă, dar pentru ora 7 nu e realizabil.
- Planul școlii: ora 7 „Efecte de animație și de tranziție. **Când ajută și când încurcă**”. Lecția are regula („Nu amesteca 10 tranzitii diferite - arata amatoriceste!”), iar Ex.2 face o comparație Fade/Cube/Morph — cea mai apropiată activitate de „când încurcă”.

## Specialistul (designer de prezentări, 2026)
- Mesajul „o tranziție discretă, aplicată uniform” e practică actuală. Microsoft: „Atunci când sunt utilizate cu atenție, efectele de animație și efectele de tranziție vă pot ajuta să transmiteți bine mesajul” (`surse/raw/diferenta_ro.txt`).
- **Greșit la fond:** categoriile (Rotate e Dynamic Content, Gallery și Vortex nu sunt — `surse/s_dynamic_content.txt`) și capcana „ambele bifate” din rezolvarea Ex.3 (contrazisă de Microsoft, `surse/s_ambele_bifate.txt`).
- Morph e prezentat ca „transformare magica”, dar lecția nu spune condiția de lucru: obiect comun pe cele două diapozitive (Microsoft: „you'll need to have two slides with at least one object in common”, `surse/raw/morph_en.miez.txt`) — apare doar la Ex.3 și în indiciul atomului 2.
- Sunetele de tranziție: sfatul „evită în prezentări formale” e rezonabil; numele sunetelor („Applause, Chime, Click, Whoosh”) nu apar în sursele descărcate (`surse/nume_efecte.txt`).
- „Mediu (1-1.5 secunde - DEFAULT)”: nicio sursă descărcată nu dă o durată implicită; valoarea implicită diferă probabil pe efecte (neverificat). Întrebarea „durata recomandata = 1-1.5 secunde” are deci cheia bazată pe o regulă de practică, nu pe un fapt.
