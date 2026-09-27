Pregătești proba „prin ochii începătorului” pentru O lecție de Informatică și TIC, clasa a {clasa}-a.
NU ai scris lecția și nu o repari. Scrii doar ce primesc cititorii-începători (agenți cu carte închisă,
care văd DOAR textul lecției de mai jos) și cu ce se compară ei.

## Ce primești
1. Lecția din plan: nr. {nr}, „{titlu}” (modulul {modul}, unitatea {unitate}).
2. Programa pentru lecția asta (conținuturile, text exact din programa oficială):
{continuturi}
3. Competențele specifice ale unității (din programă):
{competente}
4. Ce s-a predat la clasă înainte (planul anului, nu lecția):
{anterioare}
5. Vocabularul lecțiilor care URMEAZĂ (elevul nu-l știe încă): {viitoare}
   Nu alege situații, exemple sau obiective care cer aceste cuvinte (de ex. o situație cu sunet cere
   „difuzoare”, care e vocabularul altei lecții). Nici în variante.
6. Pașii cu acțiune (vin din configurația lecției; nu îi alegi tu): {pasi_actiune}
7. Textul lecției, exact cum îl vede elevul (fișierul `index.md` al cititorilor). Între marcaje:
<<<LECTIA
{lectia}
LECTIA>>>

## Ce scrii (un singur obiect JSON, după schemă)

### `sarcini` — între 6 și 10, fiecare pentru UN cititor
- Câte o sarcină pe FIECARE pas din lista de la punctul 6, fără excepție (inclusiv una pe atelier și una pe
  „Acum în aplicația adevărată”, dacă sunt în listă), cu `tip: "exercitiu"`, `fel: "aplicare"`: elevul face
  gestul pasului pe date noi (variantă-soră). Pentru pașii care NU sunt în listă (explicații, numărat, alegeri),
  sarcini de aplicare a regulii pasului pe date noi.
- NU pune sarcini `walkthrough` (parcurgerea întregii lecții) și `teachback` (explicația pentru un coleg): le
  adaugă scriptul.
- Cel puțin două treimi din sarcinile `exercitiu`/`intrebare` sunt de APLICARE: elevul trebuie să producă ceva
  ce NU e scris în lecție, aplicând regula lecției pe DATE NOI (alte celule, alte valori, alt cuvânt decât în
  exemple). La gesturi: „scrie, în ordine, unde apeși/tastezi, ce exact și cu ce confirmi, și ce rezultat promite
  lecția”. Nu cere descrierea ecranului acolo unde lecția nu promite nimic despre el. Recunoașterea
  (alegi dintr-o listă) doar pentru vocabular, cel mult o treime.
- Nu copia exercițiile lecției. O sarcină pe un exercițiu din lecție cere o variantă-soră (alte date).
- Fiecare `text` spune: ce parte a lecției vizează (ex. „Pasul 2”, „Atelierul”, „Provocarea”); că
  răspunsul se dă DOAR cu ce scrie în lecție, cu citat pentru fiecare gest sau regulă folosită.
- Când dă verdictul NEFACUT, pe feluri (calibrare 27.09: pe V nr. 4 regula gesturilor a fost pusă greșit pe
  aplicări și a dat alarme false):
  - la un GEST în aplicație (unde apeși, ce tastezi, cu ce confirmi): NEFACUT dacă lecția nu spune UNDE,
    CE EXACT sau CU CE confirmi gestul; numește ce lipsește;
  - la APLICAREA unei reguli pe o situație nouă: situația ta lipsește din lecție prin definiție, deci NU e un
    motiv de NEFACUT. NEFACUT numai dacă lecția nu dă REGULA de care ai nevoie (sau o piesă a ei); numește
    regula care lipsește. Nu scrie niciodată „dacă lecția nu spune ce se întâmplă pentru acest exemplu, scrie
    NEFACUT”;
  - oricând: dacă două locuri din lecție spun lucruri diferite despre același gest sau aceeași regulă,
    verdictul e NEFACUT cu AMBELE citate.
- `tinta` = partea vizată; `fel` = aplicare / recunoastere / parcurgere (walkthrough) / explicare (teachback).
- Scrie în română, cu diacritice, propoziții scurte.

### `obiective` — 3-6, DIN PROGRAMĂ (nu din textul lecției), fiecare cu `text` și `fel`
Derivate din conținuturile programei de la punctul 2 și din titlul lecției din plan. Propoziții scurte,
verificabile („zona se scrie cu adresele a două colțuri opuse, despărțite de două puncte”).
- `fel: "spune"` — ce poate SPUNE elevul după lecție (o regulă, o definiție, un „de ce”). Numai acestea se
  notează din explicația pentru un coleg. Cel puțin trei.
- `fel: "performanta"` — ce poate FACE elevul (identifică piesele pe un calculator desfăcut, inserează un tabel,
  elaborează un document). O explicație în cuvinte nu le poate arăta: le verifică exercițiile și aplicația reală.
- `fel: "in_afara_lectiei"` — ceva din programă pe care lecția de azi, după titlul ei din plan, NU îl predă (de
  exemplu, e lecția altei ore). Dă un avertisment pentru profesor, nu blochează.

### `conceptii_gresite` — 3-5
Concepțiile greșite tipice ale unui elev de clasa a {clasa}-a la tema asta (din experiența de la clasă,
nu din lecție): `conceptie` (ce crede greșit elevul) și `corect`.

### `canar` — un fapt pe care îl vom schimba într-o COPIE a lecției
- `original`: o propoziție (sau o bucată de minimum 40 de caractere) copiată LITERĂ CU LITERĂ din textul
  lecției de mai sus (cu aceleași diacritice, ghilimele, spații), care apare O SINGURĂ DATĂ în text și
  afirmă un fapt despre aplicație pe care îl știi sigur din lume (cum se scrie ceva, ce face o tastă, unde
  e un buton). Alege-o dintr-un loc pe care NU îl vizează nicio sarcină (de ex. „Explică-mi altfel”, o
  legendă de imagine, o explicație laterală) și care NU e obiectivul principal al lecției.
- `inlocuit`: aceeași bucată, cu faptul schimbat plauzibil (fals în lume, dar crezut de cine citește doar
  pagina). Schimbă doar cuvintele necesare.
- `intrebare`: o întrebare la care se răspunde DOAR cu faptul acela („Conform lecției, …? Răspunde DOAR cu
  ce spune textul.”), fără să dezvălui răspunsul.
- `raspuns_pagina_regex`: expresie regulată Python (fără ancore; se caută insensibil la majuscule) care
  prinde răspunsul din textul SCHIMBAT și nu prinde răspunsul adevărat din lume.
- `raspuns_lume_regex`: expresie care prinde răspunsul adevărat din lume și nu prinde pe cel schimbat.
  În ambele, pentru litere cu diacritice folosește clase: `[ăa]`, `[âa]`, `[îi]`, `[șs]`, `[țt]`.
