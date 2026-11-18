# Sesiunea Windows de 10 minute (referința pentru Start, bara de activități, meniuri, File Explorer)

**Ce fac eu:** doar CITESC structura ferestrelor (etichete, tipuri, poziții) cu UI Automation. Nu mișc mouse-ul, nu apăs taste, nu fac capturi de ecran. Numele contului, fișierele tale recente și alte nume de fișiere se înlocuiesc cu „[… ascuns]” înainte de scriere.
**Ce faci tu:** la fiecare pas eu pornesc citirea și scriu „**Pasul N — acum**”; abia atunci faci ce scrie în coloana „Tu”, apoi **nu mai miști mouse-ul până auzi bipul** (nu da clic în consolă: meniurile s-ar închide). Dacă nu auzi bipul în 5 secunde: Esc și deschizi din nou (citirea așteaptă 60 s).
**Înainte:** închide documentele cu date de elevi (să nu apară în bara de activități sau la Recomandate). Acordul tău pentru citirea ecranului e valabil doar în sesiunea asta.

Comanda mea, la fiecare pas: `python C:/00/Projects/LearningHub_fidel/_campaign/aplicatii_fidele_2026_11/referinte/dump_shell_uia.py captura <suprafața> --cu-omul --max 60`

| Nr | Tu | Eu rulez (`<suprafața>`) |
|---|---|---|
| 0 | — | `dump_shell_uia.py pregateste` (folderul de sesiune, cu 6 fișiere fără date) |
| 1 | nimic (bara de activități să fie vizibilă) | `bara_activitati` |
| 2 | tasta Windows | `start` |
| 3 | Esc; tasta Windows, apoi în 4 secunde clic pe „Toate” | `start_toate` |
| 4 | Esc; clic dreapta pe un loc GOL de pe desktop | `meniu_desktop` |
| 5 | în meniu: „Afișați mai multe opțiuni” | `meniu_desktop_clasic` |
| 6 | Esc; Win+E; în bara de adresă scrii `%TEMP%\lh_explorer_ref\sesiune`, Enter (citirea pornește singură când titlul ferestrei e „sesiune”) | `explorer_fereastra` |
| 7 | clic pe „Nou” (sus, stânga) | `explorer_meniu_nou` |
| 8 | Esc; clic pe „Sortare” | `explorer_meniu_sortare` |
| 9 | Esc; clic pe „Vizualizare”, apoi în 3 secunde mouse-ul peste „Afișare” | `explorer_meniu_vizualizare` |
| 10 | Esc; clic dreapta pe tema.docx | `explorer_meniu_fisier` |
| 11 | în meniu: „Afișați mai multe opțiuni” | `explorer_meniu_fisier_clasic` |
| 12 | Esc; clic dreapta pe un loc gol din listă | `explorer_meniu_fundal` |
| 13 | Esc; clic pe tema.docx, apoi Alt+Enter (Proprietăți) | `explorer_proprietati` |
| 14 | închizi Proprietăți și Explorer-ul | `dump_shell_uia.py verifica` → trebuie **0** |

**Două lucruri pe care le spui tu cu vorbe (UI Automation nu le vede sigur):**
- a) La pasul 6: pe ce coloană e săgeata mică de sortare (Nume? în sus sau în jos?).
- b) După pasul 13: clic pe tema.docx, F2: ce e colorat — „tema” sau „tema.docx”? Apoi Esc.

Ce iese: `referinte/uia_windows.json` (pașii 1-5) și `referinte/uia_explorer.json` (pașii 6-13). Fereastra Proprietăți e deja citită o dată pe desktopul ascuns (`proprietati_fisier`); pasul 13 e martorul ei. Durata: ~10 minute (13 pași × ~40 s).
