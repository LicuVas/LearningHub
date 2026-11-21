# Inventarul de paritate — raport (21.11.2026, 18:32-19:30)

**Cererea:** „da, fă lista funcțiilor din lecțiile de pe proba” (contract: `contract.md`).
**Pagina pentru profesor:** https://claude.ai/artifact/EQEhqF6rWp1F1gW8sGeC4b (privată), sau local `paritate_local.html`.
**Sursa:** ce e publicat pe proba (`origin/proba` 0dcd4ffb); `proba_src/` se reface cu
`git -C C:/00/Projects/LearningHub_fidel archive 0dcd4ffb $(cat lista_pe_proba.txt) jocuri/_motor | tar -x -C proba_src` (nu e în git: e o copie).

## Numerele (după verificare și corecturi)
| Aplicația | Funcții | Are | Parțial | Lipsește | Cerute de exerciții, lipsă / parțial |
|---|---|---|---|---|---|
| Word | 106 | 25 | 38 | 43 | 55 |
| Excel | 330 | 156 | 63 | 111 | 52 |
| PowerPoint | 102 | 34 | 37 | 31 | 51 |
| File Explorer | 61 | 24 | 21 | 16 | 18 |
| Windows | 34 | 10 | 5 | 19 | 11 |
| Paint | 77 | 0 | 0 | 77 | 55 |
| **Total** | **710** | **249** | **164** | **297** | **242 din 375 cerute** |

Excel: alte 38 de funcții sunt aceleași în motorul jocurilor (`tip-excel.js`) și în lecții; numărate o dată.

## Contractul
- R1 toate fișierele citite: `uneste.py` → 0 probleme.
- R2 fiecare dovadă veche `cale:rând` există: 0 probleme.
- R3 fiecare verdict cu dovadă: 0 probleme.
- R4 verificarea pe orb (`verificare.py`, `verificare_rezultat.json`):
  - 182 de verdicte refăcute de alți agenți, 166 încercate în poligon;
  - primul eșantion (112): acord direct 88 %; după judecarea diferențelor, agenții aveau dreptate în 103 (92 %);
  - a doua trecere: toate cele 70 de „DA” Word / PowerPoint rămase (judecate din cod) jucate → 48 DA, 21 PARȚIAL, 1 NU;
  - 31 de verdicte schimbate, în `corectii.json` (ieșirile agenților rămân neatinse). Niciun NU n-a devenit DA.
  - Rămâne nesigur: „DA”-urile Excel (2 din 31 verificate erau parțiale) și Explorer / Windows (3 din 3 au ținut).
- R5 pagina: încărcată headless la 1366 și 390 px, 0 erori, fără derulare laterală.
- R6 nimic schimbat în `aplicatii/`, în lecții sau pe proba.

## Ce iese în față (pentru strategie)
- **Excel:** funcțiile de foaie de calcul sunt bune (31 din 31 dau același rezultat). Lipsesc ștergerea de rânduri și coloane, Clear All, radialul din Insert, etichetele pe grafice și datele scrise în cuvinte. Sortarea mută formulele fără să schimbe adresele: un DEFECT.
- **Word:** lipsesc fontul, culoarea, indentările, spațierea, ¶, stilul tabelului, mărimea imaginii, marginile și hârtia. Ferestrele Font, Paragraph și Page Setup se deschid, dar OK nu aplică nimic. Lipsesc și butoanele de sub fereastră pentru telefon și tablă (Ctrl+Z, săgeți, Ctrl+S). DEFECTE: Home › Copy / Cut sunt gri mereu; zoom ± dă „nesimulat”, din cauza numelui butonului (`word.js:1955-1957`).
- **PowerPoint:** lipsesc salvarea ca PDF, „înlocuiești?”, mai multe animații pe obiect, expunerea clic cu clic, temele care schimbă aspectul și imaginea inserată vizibilă. DEFECT: Delete în Animation Pane șterge obiectul.
- **Explorer / Windows:** lipsesc Acest PC, unitățile, stick-ul, browserul și Securitate Windows. Starea bibliotecii nu ține istoria, deci testele vechi nu se pot pune peste ea. DEFECT: un folder mutat în propriul subfolder dispare.
- **Paint:** nu există; lista celor 77 de funcții e caietul de sarcini.
- **Comun:** testele vechi verifică singure gestul și spun cauza greșelii. Biblioteca dă doar evenimentele, iar lecția trebuie să scrie verificarea.
