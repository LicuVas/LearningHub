# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului pe care îl joc (U11)
- 11 ani, a doua oră de TIC din clasa a V-a; nu a folosit File Explorer la școală; citește încet; nu știe cuvintele „folder”, „subfolder”, „shortcut”, „RAM”.
- Nu știe ce limbă are Windows-ul din fața lui; dacă e în română, pe ecran scrie „Documente”, „Nou”, „Alimentare”, „Închidere”, iar lecția scrie „Documents”, „New”, „Power”, „Shut down”.
- Nu știe dacă are cont propriu sau cont comun al clasei; nu știe dacă PC-ul șterge totul la repornire.
- Are 50 de minute din care primele ~8 se duc pe pornire și intrare în lecție; în aceeași oră profesorul are de ținut și lecția 4 (poziția corectă).
- Nu vede rezolvările (sunt pliate); vede după fiecare răspuns „Corect!” sau „Perfect!” chiar dacă a greșit (în același bloc cu „Incorect”).

## Ce am făcut, pas cu pas
1. **Sarcina „Încearcă singur” e PRIMUL lucru din lecție**, înaintea regulilor. Elevul face foldere și salvează înainte să i se spună ce e un folder (pasul 3) sau Ctrl+S (pasul 4). Ajutoarele pliate explică doar crearea folderului și Ctrl+S.
2. Am executat pașii pe disc (`u1_sarcina.py`): 4 foldere imbricate + `Test_Organizare.txt` + 5 salvări. Structura obținută e identică cu desenul din lecție. Pe calea fericită, sarcina e corectă.
3. **Ramura „a doua clasă la același PC”** (5AM vineri 9:00, 5M imediat după sau în altă oră, același cont): folderul „Scoala” există deja, iar `Test_Organizare.txt` există cu textul primei clase. Numele fișierului e fix, dat de lecție, deci al doilea elev suprascrie munca primului (sau se oprește la întrebarea „înlocuiți?”). `07_redeschis.json`: ultimul rând din fișier e al clasei a doua.
4. **Blocajul „Documents”:** pe Windows în română folderul se numește „Documente” (Microsoft ro-ro, `surse/pas_documente.txt`).
5. **Notepad și Ctrl+S:** nu am pornit Notepad (fără ecranul utilizatorului). Lecția spune „Fisierul este salvat instant!”; la un fișier nou apare întâi fereastra de salvare, unde copilul trebuie să ajungă în `M1-Sisteme` prin 4 niveluri — asta e partea grea a sarcinii și lecția nu o descrie.
6. Chestionarele: cele 10 chei corespund variantei explicate (`u5_iesire.json` A1). Mesajul după un răspuns greșit: „❌ Incorect” urmat de „💡 Corect! …” (B).
7. Exercițiile 1-3: am scris răspunsurile unui elev de 11 ani (`u1_raspunsuri_elev.json`). Salvarea răspunsului rămâne doar în browserul acelui PC (`u7_salvare_iesire.json`).
8. Oprirea: „Start → Power → Shut down” e corect în engleză; în română „Alimentare → Închidere” (`surse/pas_oprire.txt`). Print Screen → Paint merge conform Microsoft; posterul încape într-un ecran (`u2_poster_iesire.json`).

## Unde se blochează, după mine (ipoteze AI, de verificat la oră)
- la „Documents” (dacă Windows e în română) și la „New → Folder” pe Windows 11;
- în fereastra de salvare a Notepad, la găsirea folderului `M1-Sisteme`;
- la a doua clasă: „există deja” / „înlocuiți fișierul?”;
- la exercițiul 2: copilul scrie „opresc calculatorul” ca prim pas, pentru că așa spune rezolvarea, deși lecția interzice atingerea PC-ului cu mâinile ude.
