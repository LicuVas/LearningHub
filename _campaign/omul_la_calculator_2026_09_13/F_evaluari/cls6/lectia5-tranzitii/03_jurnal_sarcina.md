# 03 — Jurnalul sarcinii (U1, U11) · cls6/lectia5-tranzitii

## Constrângerile elevului pe care îl joc (U11)
- 12 ani, clasa a VI-a, citește încet (ritm provizoriu al porții: 100 de cuvinte/minut, 20 s/clic, 50 de caractere/minut).
- A trecut prin lecțiile 1-4, dar **nu are un fișier salvat** de la ele: nicio lecție nu a cerut „Salvează prezentarea” (lecțiile 1-4, JURNAL). Butonul „Salveaza raspunsul” de pe pagină păstrează doar textul din casetă, nu fișierul .pptx.
- Nu știe engleză suficient cât să potrivească „Transitions / Apply To All / Advance Slide / On Mouse Click” cu un ecran în română, dacă laboratorul are Office în română (necunoscut).
- Nu știe ce versiune de PowerPoint are; lecția scrie de 5 ori „PowerPoint 2019+” lângă Morph (innerText r. 98, 264, 718, 729, 753).
- Are 50 de minute pentru ora 7, în care intră și lecția 4 (animații).
- Când lucrează, rezolvarea e pliată — nu o vede.

## Povestea pașilor (ce am făcut în fișier; `u1_construieste.py` → `produs_elev/`, recitit de `u3_verifica.py`)
1. **„Încearcă tu”** (primul ecran): „Deschide o prezentare existenta SAU creeaza 3 slide-uri”. Nu există prezentare veche → 3 diapozitive noi (`Tranzitii_incearca_tu.pptx`). Fila „Transitions” = „Tranziții” în română (`surse/s_fila_tranzitii.txt`). Push: numele românesc **nu apare** în nicio pagină Microsoft descărcată. „Apply To All” are chiar pe aceeași pagină Microsoft două traduceri („Se aplică tuturor” / „Se aplică pentru toate”). Recitit din XML: 3 × `push`.
2. **Atomii 1-5** (H_vede: 5 pași, 0 blocați). Aici se oprește elevul slab: la atomul 2 e întrebat de **Shift+F5** și de **sunete**, predate abia la atomii 5 și 4 (`u3_iesire.json`: 5 din 10 întrebări sunt înainte de predare). Răspunsul se blochează după selectare — ghicitul costă.
3. **Ex.1 minim**: 5 diapozitive, Push, „From Right” (= „De la dreapta”, sub „Opțiuni efect”), 1 s, Apply To All, F5. Recitit: 5 × push, `dir=l`, `p14:dur=1000`, avansare la clic. E singurul exercițiu pe care elevul îl termină sigur — dar numai dacă tastează puțin pe diapozitivele 2-4.
4. **Ex.2 standard**: trei runde. Fade = „Estompare” (confirmat). **Cube** — nici numele, nici elementul XML nu există ca atare (în MS-PPTX nu e `cube`; l-am scris ca `prism`, ipoteză). **Morph** cere un obiect comun pe 2 diapozitive — lecția nu spune asta la Ex.2; am pus același cerc, mutat și mărit (`Tranzitii_ex2_runda3.pptx`, randat). Categoria „Dynamic” pentru Morph nu e confirmată (nu e în lista celor 7 Dynamic Content, `surse/s_dynamic_content.txt`).
5. **Ex.3 performanță**: 6 diapozitive, fiecare cu alt timer, deci **fără Apply To All**: 6 × (debifez „La clic de mouse”, bifez „După”, tastez secundele). 9 animații (Fly In, Fade, Wipe, Zoom, 3 × Appear, Grow & Turn) = practic lecția 4 reluată. „Duplica slide-ul 3” copiază și animațiile lui: diapozitivul 4 din fișierul meu are 2 animații moștenite pe obiectele care se metamorfozează — lecția nu spune ce faci cu ele. Recitit: 0 diapozitive așteaptă clic; rularea durează **53,1 s**, nu 41 s cât fac timerele, pentru că timerul pornește după ultima animație (`surse/s_timer_dupa_animatie.txt`).
6. **Capcana din rezolvarea Ex.3**: „daca ramane bifat On Mouse Click alaturi de After, prezentarea tot asteapta click”. Fals după Microsoft (`surse/s_ambele_bifate.txt`: avansează automat, clicul doar grăbește) și contrazis chiar de atomul 4. Un elev care a învățat corect la atomul 4 e „corectat” greșit la final.

## Unde se blochează un începător — IPOTEZE (simularea AI e prea competentă; de notat la oră)
- caută „Transitions”/„Push”/„Apply To All” pe un ecran în română;
- nu are prezentarea „existentă” și pierde 4-5 minute refăcând diapozitive;
- nu vede tranziția în modul normal și crede că n-a mers (Indiciul #2 e pliat);
- la Ex.2 runda 3: Morph „nu face nimic” (lipsește obiectul comun sau versiunea e 2016);
- la Ex.3: lasă „La clic de mouse” bifat și crede, după rezolvare, că de aceea „nu merge”;
- la întrebările atomului 2 (Shift+F5, sunete) ghicește, pentru că nu s-au predat încă.

## Puncte de verificare vizibile pe care le are lecția
- „Observa cum slide-ul impinge pe cel vechi!” (după F5) și „vezi o mica stea langa numarul slide-ului” — Microsoft spune „pictograma de tranziție în panoul de miniaturi” (`surse/s_pictograma.txt`), nu „stea”; forma pictogramei nu am confirmat-o.
- Nu există „ridicați mâna când…”; profesorul poate folosi pictograma din panoul de miniaturi ca punct de control.
