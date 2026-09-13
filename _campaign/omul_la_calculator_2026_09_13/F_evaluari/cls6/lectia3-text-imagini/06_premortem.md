# 06 — Pre-mortem (U14) + explicații alternative (U13) + sala reală (U17)

*Abatere de la protocol: motivele au fost notate în timpul citirii (pasul 2), dar fișierul l-am scris abia la pasul 5, împreună cu verificările.*

## „Ora de 16.10 a eșuat. De ce?”
1. **N-au ajuns la calculator.** 4.084 de cuvinte până la Ex.1 = 41 min de citit la 100 cuv/min; lecția întreagă = 55 min.
   *Verificare făcută:* `u12_sensibilitate.txt`: drumul minim (Ex.1) cu lecția întreagă = 105 min (ritm dublu 56,5); dacă se sare EXTINDEREA (atomii 6-10) = 74 min (ritm dublu 41). Ora încape doar dacă profesorul taie din lecție și elevii citesc de două ori mai repede.
2. **Blocați de întrebări nepredate.** Lecția oprește elevul până răspunde corect.
   *Verificare făcută:* `u3_iesire.json`: 3 din 12 întrebări stau înaintea atomului care le predă (SmartArt „Process” la atomul 1, predat la 7; Bring to Front și Ctrl+G la atomul 2, predate la 9). Doar 1/12 e despre atomul propriu; restul întreabă înapoi. Același decalaj ca la lecția 2.
3. **Fără imagini.** Toate exercițiile cer imagini („Minim 1 imagine per slide”, „5 imagini HD”), iar sursele date sunt internetul și Stock Images.
   *Verificare făcută:* `surse/s_imagini_stoc.txt`: fără abonament Microsoft 365, biblioteca e parțială; lecția are 0 `<img>` (u9_quiz.json) și nu dă un dosar de imagini. Dacă laboratorul are internet și ce Office are: **nu se poate fără sală**, pentru că dotarea e necunoscută.
4. **Elevul caută „Picture Format” și nu-l găsește.**
   *Verificare făcută:* `04_mediu.md`: în română e „Format imagine” / „Formatare imagine”, „Trunchiere la formă”, „Eliminare fundal”, „Aliniere la diapozitiv”. Ce limbă are laboratorul **nu se poate afla fără sală**.
5. **Profesorul predă doar atomii 1-5 („ești pregătit pentru lecția următoare”), apoi Ex.1 cere forme și regulile de design.**
   *Verificare făcută:* `u3_iesire.json extindere`: Ex.1 minim cere „Forme geometrice decorative” (atomul 6) și 6x6 + contrast + consistență (atomul 10); rezolvarea Ex.2 standard cere Align (atomul 9). Programa (`u16_programa.txt`) pune formele la nivelul de bază.

## U13 — pentru semnalările grave: altă explicație + observația care le deosebește
| Semnalare | Explicația alternativă | Observația care le deosebește | Rezultat |
|:--|:--|:--|:--|
| Timpul nu încape | Lecția e gândită pe două ore sau ca material de acasă, nu pentru ora 6 | Calendarul: câte ore are tema „formatare”? Lecția scrie undeva „2 ore”/„acasă”? | `Calendar_ore_6A_6M.md`: o singură oră (16.10), ora 7 = animații. Grep „acasa”/„2 ore”/„doua ore” în innerText: 0 (`u13_grep.txt`). Explicația cade. |
| Întrebări înainte de predare | Sunt întrebări de „recapitulare” intenționate, amestecate | Întrebările din atomii târzii (5-10) întreabă înapoi; cele din 1-2 întreabă înainte. La recapitulare intenționată n-ar exista întrebări despre conținut viitor | 3 întrebări despre atomii 7 și 9 stau la 1-2: nu e recapitulare. Tiparul = decalaj de lot, ca la L2. |
| Proporțiile imaginii („2013+” vs Shift) | Microsoft are dreptate și lecția greșește | Fișiere reale PowerPoint: imaginile au blocarea bifată? | `u13_iesire.json`: 97% da, din 2007. Lecția are dreptate pe fond; greșește doar anul și se contrazice cu atomul 5 → **minor**, nu important. |
| Bannerul EXTINDERE contrazice programa | Autorul a numit „programă” doar lista de conținuturi, iar formele ar fi „obiecte” deja predate în L2 | L2 predă formele? | `u10_repetitii.txt`: „Shapes” apare o dată în L2, fără pași. Formele se predau aici, deci bannerul le scoate din bază. |
| Date personale la Ex.1 | „Numele membrilor familiei” poate fi doar prenumele, deci inofensiv | Lecția spune „prenume” sau „inventate”? | Textul: „Text cu numele membrilor familiei”, fără „inventat”; la slide 5 scrie explicit „inventate”. Deci la slide 3 nu cere. |

## U17 — sala reală
- **Brauner, sala 1 TIC (6A, 16.10):** ora e posibilă doar cu PowerPoint desktop; SmartArt, Eliminare fundal, Imagini de stoc depind de versiune. Pregătire: un dosar pe fiecare PC cu 10-15 imagini libere (animale, hobby-uri), Ex.1 tăiat la diapozitivele 1, 2, 4.
- **Brauner 6M (sala 4/5):** laborator neconfirmat → aceeași variantă ca la Izvoare.
- **Izvoare (VI, 13.10), fără laborator — plan A pe hârtie:** se poate ține ora de „design” (atomii 3, 10 și Ex.2) fără calculator. Fișa: un diapozitiv „prost” tipărit color (20 de rânduri, roșu pe portocaliu), elevii îl refac pe o foaie A4 cu chenar 16:9 (regula 6x6, un titlu, un loc desenat pentru imagine), apoi schița celor 5 diapozitive „Despre mine” ca storyboard. Formatarea propriu-zisă (Ctrl+B, trunchiere, grupare) nu se poate exersa pe hârtie; rămâne demonstrație, dacă există videoproiector (neconfirmat).
