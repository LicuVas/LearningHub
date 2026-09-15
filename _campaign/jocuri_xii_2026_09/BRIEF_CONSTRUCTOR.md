# Brief comun — constructorii jocurilor de a XII-a (proba D)

Ești CONSTRUCTORUL unei lecții-joc pentru elevii de a XII-a care se pregătesc de proba D (competențe digitale).
Scrii DOAR în folderul jocului tău: `C:\00\AI_0\projects\subcompetente-digitale\jocuri\<slug>\index.html`.
NU editezi motorul (`jocuri\_motor` sau `C:\00\Projects\LearningHub\jocuri\_motor`). Dacă găsești un defect de motor, îl descrii în răspunsul final.

## Citește întâi (Grep înainte de Read; Read cu offset/limit)
1. Doctrina: `C:\00\Projects\LearningHub\jocuri\README.md`, mai ales §9 (lecțiile învățate).
2. **Modelul de urmat:** `C:\00\AI_0\projects\subcompetente-digitale\jocuri\excel-xii\index.html`.
   - Păstrezi aceeași structură, același head și același config: `eticheta`, `acasa`, `ancoraText`.
   - Schimbi doar culoarea de accent și conținutul.
   - Raportul evaluatorului pe acest model e în `C:\00\Projects\LearningHub\_campaign\jocuri_xii_2026_09\excel-xii\raport.md`. Citește-l: acolo sunt greșelile de NU repetat.
3. Tipurile de întrebări:
   - incluse în `motor.js`: choice, tf, order, classify, match, hunt, pick;
   - `tip-traseu.js`: drumul prin meniu; butoanele se amestecă singure;
   - `tip-foaie.js`: foaia de calcul;
   - `tip-interogare.js`: grila Access, rulată pe tabel.
   Citește comentariul din capul fiecărui fișier.
4. Ce cere examenul (sursa de adevăr):
   - `C:\00\Projects\LearningHub\data\proba_d\HARTA.md`: clasamentul pe puncte al aplicației tale;
   - `operatii.json`: exemplele reale, cu `sursa`, `detalii` (drumul exact prin meniu) și `puncte`;
   - rezolvările comentate: `C:\00\AI_0\projects\subcompetente-digitale\content\rezolvari\<sursa>`.
5. Ancora: `C:\00\Projects\LearningHub\data\proba_d\unitati_xii.json`. Unitatea aplicației tale are câte o lecție pentru fiecare operație: `nr` + `titlu` = ID-ul operației.
   - `lectii` = aceste `nr`;
   - `continuturi` = ID-urile operațiilor, exact cum sunt scrise acolo.

## Divide et impera (miezul pedagogic)
- Fiecare cerință de examen se sparge în atomi:
  - (a) ce selectezi;
  - (b) pe ce drum din meniu ajungi la comandă;
  - (c) ce opțiune sau valoare setezi.
- Nivelurile urcă de la atom, la atomi combinați, la o bucată de subiect real punctată ca la barem.
- **Nivelurile se ordonează după PUNCTELE din HARTA.md.** Top 10 operații ale aplicației trebuie antrenate toate.
- Joc de învățare: 6–8 niveluri.
  - Fiecare nivel: pagină de citit de 60–120 de cuvinte (română cu diacritice, clară pentru elevi slabi la IT) + 4–5 întrebări.
  - Ultimul nivel are `final:true`: 4–5 cerințe dintr-O variantă reală, numită în text („BAC 2016, varianta 4”), cu punctele ei și cu datele exacte din sursă.

## Lecțiile pilotului Excel (obligatorii)
1. **Acceptă TOATE drumurile corecte** pe care le acceptă baremul (`ok` = listă de indici): clic dreapta, scurtătură, alt meniu. Un indiciu nu are voie să spună că ceva corect e greșit.
2. **Pagina de citit nu dă răspunsul** unei întrebări din nivelul final. Exemplele din text sunt altele.
3. **Nu inventa defalcări de barem.** Dacă baremul variantei nu e pe disc, scrii „punctaj total X p”. Enunțul se copiază COMPLET.
4. **Fără dubluri:** același fapt nu se întreabă de două ori reformulat.
5. **Distractorii sunt comenzi REALE** ale aplicației, puse greșit, de lungime apropiată de răspunsul bun.
6. **Etichetele din meniu** se scriu `English (Română)`.
   - Termenul românesc doar când e sigur că e cel din Office în română; altfel doar englezește.
   - La primul nivel, o propoziție îi spune elevului că în laborator meniurile pot fi în română sau în engleză.
7. **Nu afirma rezultate pe care nu le poți verifica.** Când rezolvarea și cunoștințele tale se contrazic, fie formulezi prudent, fie dai ambele cazuri.
8. Grilele și butoanele încap la 320 px: lasă poarta să verifice.

## Poarta (TRECUT obligatoriu; repari avertismentele care contează)
```
python C:\00\AI_0\projects\subcompetente-digitale\jocuri_sync.py
python C:\00\Projects\LearningHub\jocuri\_motor\test_joc.py --dir C:\00\AI_0\projects\subcompetente-digitale\jocuri <slug>
```

## Răspunsul final (sub 250 de cuvinte)
- linia de la poartă;
- pe fiecare nivel: titlul, tipurile de întrebări și variantele reale folosite;
- etichetele românești de care NU ai fost sigur;
- defecte sau limite de motor;
- ce ai schimbat față de plan și de ce.
