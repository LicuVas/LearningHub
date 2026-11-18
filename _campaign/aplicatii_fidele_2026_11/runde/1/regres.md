# Runda 1 · REGRES (pasul 7) — ce a crescut, de ce, și de ce NU am dat înapoi biblioteca

Măsurarea parțială de după (`masurare_partiala.log`, `iesiri_partiala/`, 18.11 18:4x) față de pornire
(`masurare_pornire.json` + `masurare_pornire_O6.json`, `iesiri_pornire/`). Măsurarea întreagă de la pasul 7:
`masurare_dupa.log` / `masurare.json` (cifrele finale stau în `raport_constructor.md`).

## 1. O7 (textul lecțiilor): 355 → 794 (+439) — DOAR motivul nou `lipsa_in_biblioteca`
- Toate motivele vechi sunt identice, citat cu citat: `fara_referinta` 217, `comanda_inexistenta` 74, `neacoperit` 39,
  `loc_gresit` 14, `dialog_inexistent` 10, `fila_inexistenta` 1 (`iesiri_pornire/O7` vs `iesiri_partiala/O7`, 1102 citate
  judecate în ambele). Cele +439 sunt toate `lipsa_in_biblioteca`.
- Mecanismul (cod înghețat, nu-l ating): `oracole/oracol_text_ui.py:29-43` construiește indexul bibliotecii din instanțele
  în mod „convenție” ale PAGINILOR DIN INVENTAR de îndată ce `structura_lib.biblioteca_exista()` (`structura_lib.py:1954`:
  orice `aplicatii/**/*.js`) e adevărat; `oracol_text_ui.py:63-65` numără `lipsa_in_biblioteca` orice citat găsit în
  referință și negăsit în acel index. În etapa B nicio lecție nu încarcă biblioteca (mutarea e etapa C), deci indexul e
  gol: fiecare citat Office bun în referință devine „lipsă în bibliotecă”. Creșterea apare la PRIMUL fișier `.js` din
  `aplicatii/`, oricât de fidelă ar fi biblioteca.
- De ce NU am dat înapoi: regula pasului 7 („orice oracol crește → git restore”) aplicată aici înseamnă că biblioteca nu
  poate exista deloc înainte de etapa C — runda 1 (care, după supliment, o construiește) n-ar putea lăsa nimic. Biblioteca
  NU e comisă (fișiere noi, nepuse în git): orchestratorul o poate scoate într-o comandă dacă hotărăște altfel
  (`rm -r C:/00/Projects/LearningHub_fidel/aplicatii`). **Hotărârea e a orchestratorului**, înainte de pasul 9: fie
  acceptă creșterea lui O7 ca artefact de etapă (și o notează în jurnal), fie o rundă `acoperire` schimbă O7 să judece
  biblioteca doar pe paginile care o încarcă.

## 2. O4 (comportament): 162 → 128 la total, DAR Explorer a pierdut 14 scenarii care treceau
- Word: 74 → 10 (45 de scenarii la fel ca Word real; rămân 7 fără rezultat real probat, 1 neexecutabil, 1 cu diferență
  sub-pixel — `diferente.md` B1, B2).
- Explorer: înainte 14 `ok` + 4 cu diferențe (jucate pe simulatorul VECHI, prin adaptorul din `sim_runner.js`); acum
  toate 18 `neexecutabil`: „pregătirea a eșuat: „explorer” nu e încă în bibliotecă”.
- Mecanismul (cod înghețat): `oracol_comportament.py › pagini_candidate` pune `aplicatii/poligon.html` PRIMA;
  `sim_runner.js › motor()` (rândul 56) întoarce „biblioteca” de îndată ce `LH.aplicatii` există, pentru ORICE aplicație;
  `oracol_comportament.py › joaca` (rândurile 382-384) se oprește la prima pagină cu motor când pregătirea eșuează, fără să
  încerce paginile vechi. Deci cât timp biblioteca n-are Explorer, scenariile Explorer nu mai ajung la adaptorul vechi.
- Totalul O4 NU crește (scade cu 34), deci regula nu cere întoarcerea; dar regresul de acoperire e real și îl semnalez:
  se închide când Explorer intră în bibliotecă (valul lui) sau dacă o rundă `acoperire` face `joaca` să treacă la pagina
  următoare când pregătirea eșuează.

## 3. Celelalte
- O3 18546 = 18546, O8 102 = 102 (măsoară lecțiile; neschimbate, cum era de așteptat în etapa B).
- O5 201 → 154 (Word 48 → 1: `word.acces_rapid`, bara ascunsă ca în referință). O9 48 → 41 (Word 8 → 1: cazul F cere o
  lecție, etapa C).
- Poarta `date_personale` rulată separat cu biblioteca pe disc: 0.
