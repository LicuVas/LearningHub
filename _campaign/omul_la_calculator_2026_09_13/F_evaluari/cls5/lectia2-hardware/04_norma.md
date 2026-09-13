# 04 — Norma din afara documentului (U16)

## Diacritice
- **Regula proiectului**, `C:\00\Projects\LearningHub\LESSON_SPECIFICATION.md` r. 401: „**Diacritics IN content:** Use proper ă, â, î, ș, ț in body text”; checklist r. 751: „Romanian text with proper diacritics (ă, â, î, ș, ț)”.
- **Măsurat** (`u3_verifica.py` → `u3_iesire.json`, aceeași formulă ca poarta): **0,0 diacritice la 1000 de litere**; 0 ș/ț cu virgulă, 0 ş/ţ cu sedilă.
  Text românesc normal ≈ 40-60. Nici excepțiile amestecate din lecția 1 („cauți”) nu mai apar — lecția e complet fără diacritice.
- Exemple de pe ecran: „Invatare Atomica”, „Progres lectie”, „Placa de Baza”, „Iesire”, „Raspunsul se blocheaza dupa selectare”.

## Programa (OMEN 3393/2017, anexa 2; standarde O. ME 4.615/2026) — din `C:/00/AI_0/data/informatica_gimnaziu/curriculum.json`
- CS.1.1 „Utilizarea eficientă şi în condiţii de siguranţă a dispozitivelor de calcul”.
- Activitate de învățare: „identificarea componentelor hardware (de exemplu utilizând: componente ale unor calculatoare dezasamblate, simulatoare virtuale, filme didactice, planşe etc.) cu evidenţierea rolului componentelor hardware și a interacțiunilor dintre acestea”.
  → programa cere **material vizual** (planșe, filme, simulatoare); lecția nu are niciunul și trimite la Google Images.
- Conținuturi: „Structura generală a unui sistem de calcul · Rolul componentelor hardware · Dispozitive de intrare … · Dispozitive de ieșire … · Dispozitive de intrare-ieșire … · Dispozitive de stocare a datelor”.
  → afirmația lecției „Conform programei scolare, dispozitivele hardware se clasifica in patru categorii” e **susținută** (cele patru apar ca titluri de conținut). Dar provocarea de la început folosește **cinci** categorii (adaugă „componenta de procesare”).
- Termenii programei sunt **intrare / ieșire**; lecția folosește de 42 de ori „INPUT/OUTPUT” cu majuscule (inclusiv în șablonul de completat: „Tip: INPUT / OUTPUT / INPUT-OUTPUT”) față de 58 „intrare/iesire” (`u3_iesire.json`).

## Planul 2026-2027 (Calendar_ore_5AM_5M.md)
Ora 4 (02.10) = structura + rolul componentelor; ora 5 (09.10) = dispozitive I/O; ora 6 (16.10) = stocare + unități. Lecția acoperă 4 + 5 + jumătate din 6.

## Specialistul (tehnician de service) — ce e depășit sau greșit în 2026
- „3 GHz = 3 miliarde de operații pe secundă” — greșit la fond (`surse/ghz_sursa.txt`, „gigahertz myth”).
- „Cache 8 MB”, „RAM 4–32 GB”, „SSD 256 GB – 2 TB”, „PSU 500–750 W” — plauzibile pentru un PC de birou/jocuri în 2026, nesursate în lecție; nu le semnalez.
- Regula de siguranță („nu deschide carcasa”, PSU reține energie) — corectă și potrivită vârstei.
