# 04 — Norma din afara lecției (U16)

## Diacritice
- Măsurat pe `innerText.txt` (fără textul pliat marcat `[ASCUNS]`): **0,0 diacritice la 1000 de litere**. Un text românesc normal are ≈ 40-60 (controlul din pilot: 52,3).
- Nicio literă ş/ţ cu sedilă — pentru că nu există nicio diacritică.
- Norma proiectului, `C:\00\Projects\LearningHub\LESSON_SPECIFICATION.md`:
  - :401 — „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”
  - :751 — „- [ ] Romanian text with proper diacritics (ă, â, î, ș, ț)”
  - :400 — titlurile `<title>` și numele fișierelor rămân fără diacritice (ASCII-safe) — deci doar corpul lecției trebuie reparat.
- Exemplu din lecție: „Functiile Excel sunt ca acele butoane speciale” (corect: „Funcțiile Excel sunt ca acele butoane speciale”); etichetele pe care le tastează elevul: „Nota minima”, „Marti”, „Sambata” — în catalogul real: „Nota minimă”, „Marți”, „Sâmbătă”.

## Programa (OMEN 3393/2017, anexa 2, clasa a VIII-a — `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`)
- Conținut: „Funcții specifice aplicaţiei de calcul tabelar pentru **sumă, maxim, minim, medie aritmetică şi decizie**”.
  → SUM, MAX, MIN, AVERAGE, IF = exact programa. **COUNT și COUNTA nu sunt cerute** (plus, nu greșeală; dar consumă timp: atomul 5 + Ex. 3 întreg).
- CS.1.1: „Utilizarea foilor de calcul tabelar în vederea rezolvării unor situații problemă simple”; activitate: „extragerea unor concluzii pe baza datelor colectate și prin utilizarea unor funcții specifice”. Ex. 2 (stația meteo) se potrivește bine cu activitatea „experimente simple … condiții de umiditate”.
- Planul 2026-2027: ora 8 (funcții: sumă, maxim, minim, medie) și ora 9 (funcția de decizie) sunt ore **separate** (`Calendar_ore_VIII.md`, `Calendar_ore_8A_8M.md`) — lecția le pune într-un fișier.

## Limba (corectură)
- „Imaginati-va ca aveti timpii” / „Imaginati-va catalogul” — trece de la „tu” la „voi” în atomii 3 și 5; spec :399 cere „informal "tu" form”. Minor.
- Termeni englezești fără pereche românească: „range”, „Function Wizard”, „AutoComplete”, „nested functions”, „dashboard-urile”. „range” și „nested functions” au perechea dată; „Function Wizard” și „AutoComplete” nu au numele din Excel în română („Inserare funcție”, „Completare automată formulă”).
