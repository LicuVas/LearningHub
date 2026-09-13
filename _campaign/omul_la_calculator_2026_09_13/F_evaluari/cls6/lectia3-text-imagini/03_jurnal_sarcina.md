# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului pe care îl joc (U11)
- 12 ani, clasa a VI-a; a făcut lecțiile 1-2 (interfața, diapozitive, fundal), **nu știe engleză de meniu** („Picture Format”, „Crop”, „Align to Slide” nu îi spun nimic).
- Citește ~100 de cuvinte/minut (ritm provizoriu al porții); are 50 de minute din care ~8 se duc pe pornire.
- **Nu are imagini proprii pe calculatorul din laborator** și nu știe dacă are voie pe internet; nu are cont Microsoft 365.
- Nu vede rezolvările pliate când lucrează; nu știe unde se salvează fișierul.
- Simularea mea e prea competentă (cercetarea din `A_cercetare` §2.1): blocajele de mai jos sunt **ipoteze**, trecute în `anexa.blocaje_probabile_ipoteza` ca întrebare pentru Vasile.

## Ce am făcut, pas cu pas (`u1_construieste.py` → `produs_elev/`)
1. **Încearcă tu** (`Incearca_tu.pptx`): titlu colorat, 3 texte formatate diferit, 2 imagini, o formă, notițele „ce a fost greu”. Primul blocaj real: **de unde iau cele 2 imagini?** Lecția spune „de pe calculator sau de pe internet”; eu le-am generat cu PIL. Într-un laborator fără imagini pe disc și fără internet pasul nu se poate face.
2. **Ex.1 „Despre mine”** (`Despre_Mine.pptx`, 5 diapozitive). Am respectat cerințele și „Regulile obligatorii”; verificat la redeschidere: 5/5 respectă 6x6, font minim 28 pt, un singur font, cel puțin o imagine pe fiecare diapozitiv (`07_redeschis.json`).
   - **Diapozitivul 2** cere „Imagini mici lângă fiecare hobby”. Randat (`randat_pptx/Despre_Mine_p2.png`): patru rânduri de 28 pt ocupă ~5 cm, patru imagini ~10 cm, deci imaginile nu stau lângă rânduri. Ca să iasă, elevul trebuie ori o casetă pe fiecare hobby, ori spațiere între rânduri. Lecția nu predă niciuna. Loc sigur de „mâini sus”.
   - **Diapozitivul 3** cere „numele membrilor familiei”, în același exercițiu care spune „NU pune date personale reale”. Am pus nume inventate; un copil de 12 ani va scrie numele reale ale mamei și ale fraților (și, la extindere, „SmartArt Hierarchy cu poze”).
   - **Diapozitivul 5** cere doar forme + contact inventat, dar regula „Minim 1 imagine per slide” cere și imagine. Am adăugat una; cele două cerințe nu se potrivesc.
   - Lecția **nu spune să salvez** prezentarea, nici cu ce nume (pas 11, `gasit: neclar`).
3. **Ex.2** (`Slide_Prost_Bun.pptx`): diapozitivul prost (20 de rânduri, 12 pt, 3 fonturi, roșu pe portocaliu = contrast 1,74:1) și cel bun (4 rânduri, 24 pt, negru pe alb 21:1). Plus 5 îmbunătățiri, 3 lecții și 3 răspunsuri de reflecție tastate: ~450 de caractere, cel mai lung pas de scris (24 min la ritmul porții).
4. **Ex.3** (`Proiect_Educational.pptx`, 8 diapozitive): titlu cu gradient + umbră (XML), imagine decupată în cerc cu umbră, 3 forme grupate, aliniate și distribuite (poziții calculate), liste. **SmartArt** și **Eliminare fundal** nu se pot face în fișier; au rămas pași `interfata`. LibreOffice randează gradientul cu o singură culoare: randarea probează conținutul, nu aspectul din PowerPoint.

## Unde se blochează un începător (ipoteze)
- „Picture Format”, „Crop to Shape”, „Align to Slide” într-un Office românesc (Format imagine / Trunchiere la formă / Aliniere la diapozitiv, `surse/s_*.txt`).
- Întrebarea cu SmartArt „Process” pusă la atomul 1, iar Bring to Front și Ctrl+G la atomul 2, înainte ca atomul 9 să le predea: elevul ghicește și lecția îl blochează până răspunde corect.
- Imagini: de unde, și dacă „Stock Images” există în Office-ul din laborator.
- Imaginile care nu se aliniază cu rândurile listei (Ex.1, diapozitivul 2).
- Timpul: 4.084 de cuvinte de citit înainte de Ex.1.
