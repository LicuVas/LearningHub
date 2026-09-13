# 03 — Jurnalul sarcinii (U1, U11) · cls6/lectia4-animatii

## Constrângerile elevului pe care îl joc (U11)
- 11-12 ani, clasa a VI-a, a făcut lecțiile 1-3 (a văzut panglica, a pus casete text și imagini). N-a mai folosit animații.
- Nu știe engleză de meniu: „Animations”, „Animation Pane”, „Effect Options”, „After Previous” sunt pentru el cuvinte de recunoscut după formă, nu de înțeles. Dacă PowerPoint-ul din laborator e în română, nu găsește niciunul (vezi 04_mediu.md).
- Citește încet (ritm provizoriu al porții: 100 de cuvinte/min); nu deschide pliantele „Vezi rezolvarea” când lucrează.
- Are 50 de minute din care ~8 se duc pe pornire; în planul școlii, în aceeași oră ar trebui să facă și tranzițiile (lectia5).
- Nu are o prezentare de la ora trecută deschisă: lecția îi cere de fiecare dată „creeaza un slide”, nu îi spune pe ce fișier lucrează și nici să salveze.

## Ce am făcut, pas cu pas (U1)
Fișierul: `produs_elev/Animatii_elev.pptx` (5 diapozitive), construit de `u1_construieste.py`: conținutul cu python-pptx, iar animațiile scrise direct în XML (`p:timing`) cu lxml, pentru că python-pptx nu are comenzi pentru animații. Recitit în proces nou de `u3_verifica.py` → `07_redeschis.json`. Randat de LibreOffice → `randat_pptx/Animatii_elev.pdf` (5 pagini; randarea arată doar starea statică, nu mișcarea).

1. **„Încearcă tu”** (diap. 1): casetă „Bine ai venit!” + Estompare la clic. Se face ușor. Punctul bun al lecției: primul ecran chiar cere o acțiune (se vede în `ecran_prima_vedere.png`), spre deosebire de lecțiile 1-3.
   **Blocaj-ipoteză:** Indiciul #1 spune că fila Animations nu se vede dacă nu ai selectat un obiect. Fila e mereu în panglică (se deschide și cu Alt+A, `surse/s_fila_animatii.txt`); ce lipsește fără obiect selectat e galeria activă. Copilul care nu găsește fila e trimis să caute altceva.
2. **Ex.1 minim** (diap. 2): titlu + 4 casete + 5 animații. Aici am avut cele mai multe opriri:
   - „Fade Out” nu există ca nume: în lista Microsoft efectul de ieșire se numește tot „Fade”/„Estompare” (`surse/s_estompare_iesire.txt`). Elevul caută în galeria roșie „Fade Out” și nu-l găsește.
   - „Pulse” nu l-am putut confirma în nicio sursă descărcată (pas 7, `gasit: neclar`).
   - „o miscare in cerc” = Căi de mișcare → o formă închisă. Dar lecția scrisese la atomul 2 că Motion Paths „depaseste programa minima... Poti sari aceasta sectiune”. Elevul care a sărit secțiunea, cum i s-a permis, nu poate termina exercițiul **minim**.
   - 5 animații pe un diapozitiv, după ce de trei ori i s-a spus „maximum 2-3”. Recitit: 5 animații, 5 clicuri (`04_a_doua_cale.json`). Exercițiul se cheamă „slide care demonstreaza tipurile”, deci excepția e explicabilă (vezi 06_premortem.md, U13), dar lecția n-o spune.
3. **Ex.2 standard** (diap. 3): listă de 5 puncte, Fly In de jos, după paragraf, punctele 2-5 „După precedentul” cu întârziere 0,5 s.
   - Lecția scrie „In Effect Options, alege "Animate text: By Paragraph"”. În PowerPoint „După paragraf” e direct în Opțiuni efect, iar „Animare text” e altă listă, din caseta de dialog, unde nu există „după paragraf” (`surse/s_dupa_paragraf.txt`). Un elev care caută exact eticheta se pierde.
   - Ca să seteze doar punctele 2-5, trebuie să le vadă ca rânduri separate în panou; lecția nu spune cum se desfac.
   - Recitit din fișier: punctele încep la 0; 1,5; 3; 4,5; 6 s — adică **1,5 s** între ele, nu „la 0.5 secunde distanta” cum spune rezolvarea (întârzierea pornește după ce s-a terminat precedentul, după regula Microsoft).
4. **Ex.3 performanță** (diap. 4-5): traseu desenat în S, sincronizare, declanșator pe buton, ieșire după 2 s. Toate s-au putut scrie în fișier. Ambiguitate: ieșirea „After Previous, Delay 2s ... dupa alt eveniment” pe un diapozitiv unde singurul alt eveniment e declanșatorul (altă secvență) → în fișier pornește la 2 s după intrarea pe diapozitiv, nu după clicul pe buton. Nu am tratat-o ca semnalare separată (cere verificare în PowerPoint real).

## Unde se salvează
Lecția nu cere nicăieri salvarea prezentării (Grep în `innerText.txt` pe „salv”: doar butoanele „Salveaza raspunsul” din casetele de text ale site-ului, rândurile 698, 739, 788). Lecția următoare (tranziții) are 6 diapozitive noi, deci nu depinde de fișier, dar elevul pierde tot ce a animat.

## Blocajele probabile — IPOTEZE AI, de verificat la oră
Căutarea „Fade Out” în galeria de ieșire; secțiunea sărită (Motion Paths) cerută la Ex.1; „Animate text” la Ex.2; selectarea punctelor 2-5 în panou; numele englezești dacă interfața e în română.
