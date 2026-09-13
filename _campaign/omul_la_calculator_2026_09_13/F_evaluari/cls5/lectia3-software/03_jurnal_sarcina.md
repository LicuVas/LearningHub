# 03 — Jurnalul sarcinii (U1, U11)

## Constrângerile elevului pe care îl joc (U11)
- 11 ani, clasa a V-a, citește ~90 de cuvinte pe minut, **nu știe engleză** (nu recunoaște „Copy”, „Paste”, „Rename” scrise pe ecran în română sau ca pictograme).
- Nu a mai folosit File Explorer la școală; acasă are telefon, nu PC (ipoteză).
- Nu vede rezolvările (sunt în pliante închise); nu știe că extensiile pot fi ascunse.
- Are ~40 de minute utile din 50 (8 minute pornire + logare).
- Lucrează în contul comun al PC-ului din sala 1 TIC; nu știe dacă altă clasă a folosit PC-ul înainte.

## Ce am făcut, pas cu pas
1. **Provocarea de la început** (înainte ca lecția să explice ceva): am executat pașii 3-6 pe disc, într-un dosar-nisip (`u1_fisiere.py`): `Teme_cls5`, `Matematica`, `Romana`, `nota_de_test.txt`, copia în Matematica. Totul a mers. **Blocaj-ipoteză:** în Windows 11 meniul de clic dreapta are Copy/Paste/Rename/Delete ca **pictograme fără text** (Microsoft Support, text brut, ambele limbi — `surse/pas_meniu_contextual.txt`). Copilul caută cuvântul „Copy” și nu-l găsește. Dacă Windows-ul e în română, scrie „Copiere”, iar lecția nu dă numele românești deloc.
2. **Bonus Challenge:** redenumirea merge. Mutarea `nota_de_test.txt` în Matematica **dă peste fișierul cu același nume** (copia de la pasul 6). Explorer deschide un dialog de conflict (Înlocuire / Omitere — textul dialogului nu l-am verificat pe documentație). Am urmat toate ramurile: dacă copilul înlocuiește și apoi „șterge copia” din Matematica, rămâne cu Matematica **goală**; dacă omite, fișierul rămâne în rădăcină. Doar dacă șterge **întâi** copia și **apoi** mută obține structura cerută. Lecția nu spune ordinea.
3. **Cele 8 întrebări:** trecute toate (motorul le acceptă, `parcurgere.json`). Am greșit intenționat la pasul 1: apare „❌ Incorect. Raspunsul corect este marcat cu verde.” și imediat dedesubt „💡 ✓ Corect! ...” — același tipar ca la lecția 2, cu dovada mea (`u5_iesire.json`, `u5_dupa_raspuns_gresit.png`). Un copil citește „Corect!” și crede că a răspuns bine.
4. **Exercițiul 1:** se face din pașii 1, 2, 4. Salvat, recitit după reîncărcare; într-un profil nou de browser e gol (`u7_salvare_iesire.json`).
5. **Exercițiul 2:** am clasificat cum a învățat elevul la pasul 3 (antivirus = **utilitar**). Cerința dă doar două căsuțe („sistem” / „aplicație”), iar rezolvarea model pune antivirusul la **sistem**. Copilul care a citit atent pierde punctul sau se blochează: „unde pun utilitarul?”. Tot aici, „pasii exacst” — greșeală de tipar.
6. **Exercițiul 3:** punctul 2 (scurtătura de pe Desktop, dezinstalarea) nu se poate rezolva din lecție; rezolvarea model recunoaște singură că „NU apare in aceasta lectie”. Restul se face pe hârtie.
7. **Vrei mai mult (Task Manager → Startup apps):** numele e corect în engleză; în română fila se cheamă „Aplicații cu executare în execuție la pornire” (`surse/pas_startup_apps.txt`).

## Unde se blochează un începător (ipoteze AI — de verificat la oră)
- clic dreapta pe fișier → caută cuvântul „Copy” și vede doar pictograme;
- „Numește-l nota_de_test.txt” → scrie extensia a doua oară dacă extensiile sunt ascunse;
- dialogul de conflict la Bonus;
- Ex. 2: unde pune antivirusul;
- „C:\Documente\Scoala” — nu există așa pe disc (e `C:\Users\<cont>\Documents`), copilul care vrea să scrie calea o scrie greșit;
- a doua clasă la același PC găsește `Teme_cls5` gata făcut.
