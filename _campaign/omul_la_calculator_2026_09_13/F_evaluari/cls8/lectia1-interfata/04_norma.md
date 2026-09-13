# 04 — Norma din afara lecției (U16)

## Diacritice
- Măsurat pe `innerText.txt` (fără marcajele `[ASCUNS]`): **0,0 diacritice la 1000 de litere**; 0 caractere ş/ţ cu sedilă (nici cu virgulă — nu există deloc). Un text românesc normal are ≈ 40-60.
- Exemple de ce vede elevul: „Interfata Excel - Celule si Navigare”, „Redenumeste foaia”, „Scurtaturi de tastatura esentiale”, „Nota Romana” (text de tastat în Ex. 1).
- **Norma proiectului** — `LESSON_SPECIFICATION.md:401`: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; bifa `:751`: „Romanian text with proper diacritics (ă, â, î, ș, ț)”. Titlul `<title>` și numele fișierului fără diacritice sunt corecte (`:400` „ASCII-safe titles”).
- Consecință practică: elevul tastează antetele „Nota Matematica”, „Nota Romana” — la ora de TIC învață din lecție că antetele de tabel se scriu fără diacritice. Lecția nu spune nimic despre tastatura românească.

## Programa (OMEN 3393/2017, via `data/informatica_gimnaziu/curriculum.json`)
- **CS.1.1** clasa a VIII-a: „Utilizarea foilor de calcul tabelar în vederea rezolvării unor situații problemă simple”; activitate: „identificarea elementelor specifice de adresare şi formatare prin realizarea unui tabel de colectare a datelor”.
- Standardul (O.ME 4.615/2026), nivel de bază: „Elevul utilizează, cu sprijin, funcții și instrumente ale unei **aplicații dedicate calculului tabelar** … în pași ghidați, în contexte familiare”.
- Lecția acoperă adresarea (C7, B2:D6) și un tabel de colectare a datelor (catalogul) — **conform**. Programa vorbește de „aplicație de calcul tabelar”, nu de Microsoft Excel; lecția nu are nicio frază pentru LibreOffice Calc, deși programa nu cere un produs anume.

## Planul anului (`Calendar_ore_VIII.md`, `Calendar_ore_8A_8M.md`)
- Ora 2 = „Interfața aplicației de calcul tabelar. Structura unui registru” (15.09 Izvoare / 18.09 Brauner). Lecția mai conține conținutul orelor 3 (operații cu foile) și 4 (adresa de celulă, selectare).

## Ca specialist (contabilul care trăiește în Excel, 2026)
- Ce e predat bine și actual: adresa celulei, intervalul, Name Box pentru salt, Formula Bar ca „rețeta” celulei (verificarea „e scris de mână sau calculat?” — exact reflexul de audit al foii de calcul), Ctrl+End și „used range” în „Vrei mai mult?”.
- Ce lipsește față de cum se lucrează: **salvarea cu nume clar** (catalogul nu se salvează nicăieri), iar numărul zecimal cu punct (8.67) nu e cum îl vede un contabil român pe Windows setat în română (8,67).
- „Ribbon-ul” e numit „Panglică” în documentația ro-ro (ex. „în meniul panglicii”, `surse/foi_ro.txt`) — lecția nu dă termenul românesc.
