# 06 — Pre-mortem (U14) + explicații alternative (U13) · cls6/lectia4-animatii

## Schiță (scrisă după pasul 1, înainte de a face sarcina)
„Ora de 20/23.10.2026 a eșuat. De ce?”
1. **Timpul**: 3.572 de cuvinte de citit + 5 animații la Ex.1 + 5 setări la Ex.2 — și planul voia în aceeași oră și tranzițiile (lectia5). Nu încape.
2. **Numele din lecție nu sunt pe ecran**: lecția scrie „tab-ul Animations”, „Animation Pane”, „Fade Out”, „Wipe Out”, „Zoom Out”; dacă PowerPoint e în română, butoanele au alte nume; unele denumiri de efect s-ar putea să nu existe nici în engleză.
3. **Izvoare fără calculatoare**: animația e prin natura ei ceva ce se vede în mișcare; pe hârtie lecția se reduce la memorarea a 4 culori și a trei opțiuni de Start.
4. **Elevul n-are de unde porni**: Ex.1 cere „creeaza un slide”, nu spune să deschidă prezentarea de la lecțiile 1-3 și nici să salveze fișierul; lectia5 (tranziții) nu va avea pe ce lucra.
5. **Nivelurile se bat cap în cap**: Motion Paths e „aprofundare (optional)... depaseste programa minima”, dar Ex.1 **minim** cere „o miscare in cerc”; iar „regula de aur” (max 2-3 animații pe slide) e încălcată chiar de Ex.1 (5 animații pe un diapozitiv). Elevul bun observă contradicția, cel slab se blochează la traseu.
(+ de verificat: indiciul #1 spune că fila Animations nu se vede dacă nu ai selectat un obiect — sună greșit.)

## Completat la pasul 5 — fiecare motiv cu verificarea făcută
| # | Motivul | Verificarea | Rezultatul |
|--:|:--|:--|:--|
| 1 | Timpul | `u12_sensibilitate.txt` (formula porții) | Totul: 91,6 min (ritm dublu 49,8). Drumul minim (Încearcă tu + Ex.1, citit doar până la Ex.1): **54,5 min** — nu încape nici măcar jumătatea „animații” a orei 7, iar planul pune și tranzițiile în aceeași oră. **Confirmat**, dar ritmurile sunt provizorii → `important`, nu `blocant`. Lecția e mai scurtă decât L1-L3 (2.275 de cuvinte până la Ex.1 față de 4.084 la L3). |
| 2 | Numele de pe ecran | `surse/s_*.txt` (text brut Microsoft ro/en), `03_pasi.json` pașii 2-17 | Toate comenzile sunt doar în engleză. „Fade Out” nu există ca nume (`s_estompare_iesire.txt`); „Animate text: By Paragraph” amestecă două locuri (`s_dupa_paragraf.txt`). Limba laboratorului rămâne necunoscută. **Confirmat parțial.** |
| 3 | Izvoare fără calculatoare | Grep „hartie|caiet|proiector” în `innerText.txt` → 0 rezultate (`03_jurnal_sarcina.md`) | Lecția nu are variantă fără calculator. Pe hârtie se pot face: sortarea efectelor pe cele 4 categorii, ordonarea unei secvențe (clic/cu/după) pe o bandă de timp desenată, calculul „cât durează” (exemplul de 3,25 s din atomul 4 e corect, `04_a_doua_cale.json`). Mișcarea în sine nu se vede. **Nu se poate verifica fără sală**, pentru că nu se știe dacă la Izvoare există măcar un videoproiector. |
| 4 | Fișierul | Grep „salv” în `innerText.txt`: doar butoanele site-ului (r. 698, 739, 788); Grep în `lectia5-tranzitii.html` | Nu se cere salvarea. Lecția 5 își face propriile 6 diapozitive, deci nu se rupe lanțul, dar munca de azi se pierde. **Confirmat, minor.** |
| 5 | Niveluri contradictorii | `innerText.txt` r. 247 vs r. 676; `04_a_doua_cale.json` rândul 1 (5 animații recitite din fișier vs „maximum 2-3”) | Motion Paths „optional” cerut la Ex.1 minim: **confirmat**. Regula de aur încălcată: confirmat numeric, dar vezi U13 mai jos. |
| + | Indiciul #1 | `surse/s_fila_animatii.txt` | Fila Animații se deschide cu Alt+A și e între Tranziții și Expunere diapozitive; Microsoft spune „Selectați obiectul... Selectați fila Animații”, nu că fila apare doar după selecție. Indiciul trimite elevul pe drum greșit. **Confirmat, minor.** |

## U13 — explicații alternative pentru semnalările grave
**A. „Fade Out / Wipe Out / Zoom Out” nu există.**
- Alternativa 1: autorul a folosit „Fade Out” ca descriere („Fade, ca ieșire”), nu ca nume de buton.
- Alternativa 2: în PowerPoint desktop numele diferă de lista „pentru web”.
- Observația care le deosebește: (1) rezolvarea Ex.1 scrie „aplica o animatie din categoria Exit, Fade Out” iar atomul 2 pune „Fade Out” pe listă lângă „Fly Out” (care e un nume real, `s_estompare_iesire.txt`) — deci e folosit ca nume; (2) chiar lista web scrie „Fade In entrance” dar „Fade exit”, deci nici în lista Microsoft nu există simetria „In/Out” pe care o presupune lecția. Rămâne deschisă doar alternativa 2 → semnalarea e `important`, cu pas `interfata gasit: nu`, nu `blocant`.

**B. Ex.1 minim contrazice „regula de aur” (5 animații pe un diapozitiv).**
- Alternativa: Ex.1 e un diapozitiv-demonstrație („creeaza un slide care demonstreaza tipurile de animatii”, r. 664), nu o prezentare pentru public; regula e scrisă „pentru o prezentare profesionala” (r. 263).
- Observația: am căutat în lecție o frază care să spună excepția (Grep „exceptie|demonstr”): apare doar „demonstreaza” din enunț, nicio explicație. Alternativa e plauzibilă → contradicția cu regula de aur coboară la **minor**. Rămâne `important` doar partea „Motion Paths optional, dar cerut la minim”, care nu are altă explicație (r. 247 „Poti sari aceasta sectiune fara a-ti afecta nota” vs r. 676).

**C. Ex.2 „la 0.5 secunde distanta”.**
- Alternativa: autorul a vrut să spună „pauză de 0,5 s după fiecare punct”, nu „0,5 s între începuturi”.
- Observația: cronologia recitită din fișier (`07_redeschis.json`) dă 0,5 s pauză după terminarea precedentului și 1,5 s între începuturi. Ambele lecturi sunt compatibile cu textul → **nu** o trec ca semnalare separată; o notez în jurnal.

**D. Întrebări puse înainte de predare.**
- Alternativa: întrebarea „Start: With Previous” din atomul 1 se poate ghici din engleză („cu precedentul”).
- Observația: pentru un elev de 11 ani fără engleză, „With Previous” nu e explicat nicăieri înainte de r. 421 (atomul 4) (`u3_iesire.json`). Rămâne `important`.
