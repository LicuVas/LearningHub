# Calibrarea liniei de verificare (27.09.2026)

**De ce:** pe primele 3 lecții reale (V, VII, VIII nr. 4) linia a blocat publicarea cu 18 semnalări (plus o sarcină NESIGUR la VII, deci 19 în total). Trierea independentă (`triere_v_vii.md`, `triere_viii.md`) a găsit că **toate sunt alarme false**, adică limite ale liniei, nu defecte ale lecțiilor. Urmează încă ~24 de lecții, așa că linia nu are voie să mai strige fals. Dar nici nu are voie să devină oarbă la defecte reale.

**Ce am atins:** doar fișierele liniei (`verifica_lectie.py`, `_plan.py`, `_extrage.py`, `prompt_generator.md`) și dosarul `_calibrare\`. Lecțiile și kitul `tools\plimbare\` sunt neatinse, iar `arbitru_office.py` n-a avut nevoie de nicio schimbare. N-am făcut commit. Copia de dinainte a celor 4 fișiere e în scratchpad-ul sesiunii (`orig\`).

Rulările au rescris `raport.md` în `v-m1-l04\` și `viii-m1-l04\` (cu `--refa-raport`) și în `vii-m1-l04\` (rularea T1 finală; rularea veche e în `vii-m1-l04\t1_anterior\`). Scripturile probelor sunt în `_calibrare\` (`fa_copii.py`, `proba_invechit.py`, `proba_rmtree.py`, `proba_confirmare.py`), iar rezultatele în `_calibrare\rezultate\`. Costul T1 al calibrării e ~5,2 USD: 4 rulări complete și confirmarea, plus o rulare oprită după generator.

**Versiunile verificate.** În timp ce lucram, altă sesiune a modificat lecțiile: commit `a24281db` la 18:04, VII la 18:11 și VIII la 18:19 (VII: 10 rânduri adăugate, 9 scoase față de commit). Eu n-am scris nimic în `lectii\`. Amprenta nu s-a schimbat în timpul niciunei rulări, iar rezultatele finale sunt pe versiunile curente:
- VII: T1 final pornit la 18:13, amprenta `f0f1fae8ea…`;
- VIII: la 18:31, `a0a8907d0d…`;
- V: nemodificată de la 16:53, `fe6b171090…`.

Copiile cu defect au fost refăcute din VII-ul curent, iar S0-T0 pe ele dă aceleași rezultate. Doar cele 2 rulări T1 pe copia (a) sunt pe versiunea VII de dinainte de 18:11.

## Pe scurt

| Lecția | Înainte (blochează) | După: S0-T0 (`--fara-t1`) | După: T1 recitit din rularea veche | După: T1 nou (haiku) |
|---|---|---|---|---|
| V nr. 4 | 7 (S2: 1, T1: 6) | **0** | 2 (S-4, S-7; vezi mai jos) | nerulat (cum s-a cerut) |
| VII nr. 4 | 6 (S2: 1, T0: 2, T1: 3) + 1 NESIGUR | **0** | **0** | **0** (rularea finală; la rularea 1: 1, un teach-back fals, vezi mai jos) |
| VIII nr. 4 | 5 (T0: 1, T1: 4) | **0** | **0** | nerulat (cum s-a cerut) |

**Defectele plantate** în copii ale lecției VII nr. 4 (`_calibrare\<copie>\vii\m1-l04\index.html`, făcute de `_calibrare\fa_copii.py`):

| Copia | Defectul (unul singur) | Prins de | Numărul care blochează |
|---|---|---|---|
| `control` | niciunul: doar `<base href>` spre lecția originală | nimic, corect (la fel ca originalul) | 0 |
| `a_termen` | „aliniere” și „indentare” (vocabularul lecției 6) într-un „Încearcă” de la pasul 3, neexplicate | **T0** (2: „nedefinit nicăieri”). T1 (haiku) l-a **ratat** de 2 ori | 2 la S0-T0; 3 la rularea T1 finală (T0 2 + T1 1, un NEFACUT fals, fără legătură cu defectul) |
| `b_recun` | „Încearcă” 3, 4, 5 transformate în recunoaștere pură (răspunsul e scris chiar în pas) | **S2**: 2 din 6 (33%) < 50% | 1 |
| `c_identic` | întrebarea de verificare 1 = copie identică a exercițiului „Încă un exercițiu” 1 de la pasul 2 | **S1** (identică după normalizare) + test_joc (FAIL IDENTIC, numărat la S1) | 1 |

La (b) a trebuit să schimb trei „Încearcă”, nu unul. Pe VII, cu unul singur, practica ar fi coborât doar la 4 din 6 (67%), tot peste prag. Prima variantă a copiei (b) avea două variante greșite, „Celula” și „Grilă”, folosite înainte ca lecția să le predea. T0 le-a prins corect: erau un al doilea defect, plantat din greșeală. Le-am înlocuit, iar acum copia (b) are un singur defect și e prinsă doar de S2.

## Ce am schimbat (cele 8 reparații din triere = punctele 1-9; WinError 32 = punctul 10; 5 găsite pe drum = 11-15)

1. **Amprenta paginii** (`verifica_lectie.py` main): se ia sha256 al `index.html` la început și la sfârșit. Dacă diferă, raportul are banda „ÎNVECHIT, rulează din nou”, iar ultima linie e `-1`, nu un număr de probleme (cod de ieșire 2). Proba e `_calibrare\proba_invechit.py`: pagina modificată la 6 s după pornire dă `-1`, cod 2 și banda în raport, deci TRECUTĂ.
2. **S2 după conținut** (`_extrage.fel_practica`, `treapta_s2`):
   - execuție = exercițiu în simulator;
   - recunoaștere = răspunsul corect e deja scris într-o singură propoziție din pașii de până atunci sau din explicațiile exercițiilor de dinainte. Pragul: toate cuvintele pentru un răspuns scurt (≤ 4 cuvinte), 70% pentru unul lung, 50% la adevărat/fals. La sortare și potrivire, o pereche item–categorie contează ca găsită dacă o propoziție conține și categoria, și un cuvânt al itemului;
   - aplicare = altfel. Numerele contează ca cuvinte, deci un calcul nou („7 rânduri”) iese aplicare.

   Blochează doar sub 50% pe „Încearcă” + atelier (litera regulii 5). „Încă un exercițiu” se raportează separat, ca avertisment.

   Proba de calibrare cerută de triere (≥ 50% pe V și VII): **V 5 din 6 (83%), VII 5 din 6 (83%)**. Pe „Încearcă” + atelier, VII iese identic cu trierea, fel cu fel. VIII dă 8 din 8. Pe cele 30 de exerciții triate de mână (V + VII), linia se potrivește cu trierea la 25.
3. **T1 fără parcurgeri căzute doar pe simulator/laborator** (`_t1_detalii`, `locuri_simulator`): o parcurgere NEFACUT nu se numără dacă toți pașii ei căzuți sunt în simulator, atelier, întrebări-simulator sau „Acum în aplicația adevărată” și, la fiecare, cititorul știe ce să încerce și înțelege efectul. Rămâne avertisment („notă pentru J/R”). Parcurgerea o scrie acum scriptul, cu lista acestor locuri și instrucțiunea că „nu pot apăsa” nu e motiv de NEFACUT.
4. **T1 fără blocaje pe propoziția care introduce termenul**: un blocaj nu se numără dacă citatul e într-un paragraf de TEXT al pasului (nu într-un exercițiu), termenul e îngroșat chiar acolo și toate sarcinile care l-au semnalat au ieșit FACUT. Excepție: vocabularul lecțiilor viitoare blochează oricum (regula 9). Tot aici:
   - excepția „citat doar din antet” cuprinde acum și pasul „La ce folosește”;
   - blocajele din aceeași propoziție se numără o dată;
   - un obiectiv LIPSA la teach-back blochează doar dacă apare la ≥ 2 cititori. Scriptul pune acum DOUĂ teach-back-uri, cu plafonul de propoziții = max(8, obiective + 3). Un obiectiv GRESIT blochează oricum.

   Numărul T1 e acum numărul liniei (lista a ce blochează), nu „numărul kitului minus antet”. Diferența se explică în raport.
5. **Profilul cu clasele anterioare** (`profil_cititor`, `stiute_din_plan`): pentru fiecare clasă anterioară, profilul listează lecțiile și conținuturile programei. Termenii lor, plus definițiile din materialele cursului, trec la „știe”, iar comparația se face fără articol („copierea” = „copiere”). La VIII, „selectarea, copierea, mutarea, ștergerea” au ieșit din NU ȘTIE și sunt acum la „cuvinte pe care le știi deja”.
6. **Promptul generatorului** (`prompt_generator.md` + `genereaza`):
   - NEFACUT la aplicare numai dacă lipsește REGULA, nu exemplul;
   - primește vocabularul lecțiilor viitoare (`{viitoare}`) și e rugat să nu aleagă situații care îl cer;
   - obiectivele au `fel`: `spune` (se notează), `performanta` și `in_afara_lectiei` (devin avertismente);
   - „pașii cu acțiune” vin din configurație (`{pasi_actiune}`, `pasi_cu_actiune`): la VII sunt Pasul 3, 4, 6, atelierul și provocarea, nu și Pasul 5, care e de numărat.
7. **Conținuturile programei la lecția cu scorul cel mai mare** (`_plan.lectiile_clasei`): un conținut merge la lecția (lecțiile) unității unde scorul LUI e maxim. Dacă cuvântul-cap („formatare”) e în titlul unei lecții („Formatarea…”), conținutul merge acolo. Pragul vechi pe lecție rămâne. La VII, „Operații de formatare a unui document…” nu mai e la lecția 4 (s-a dus la 6-7). Pe tot planul s-au mutat 31 de legături duble, mai ales de la lecțiile de evaluare și de mini-proiect. Lecțiile nr. 4 ale celor 4 clase păstrează exact conținutul lor.
8. **Textul alternativ scos din T0** (`_fara_alt`): în varianta T0, „[Imagine: …]” devine „[Imagine]”. Textele alternative se păstrează în `t0\imagini_alt.txt`, pe care oracolul nu-l citește. Cititorii T1 le primesc în continuare, fiindcă ei „văd” poza doar prin ele.
9. **Densitatea fără verdict pe puține propoziții** (`treapta_t0`): o problemă de densitate pe un fișier cu sub 10 propoziții (antetul are 3-6) devine avertisment. Am numărat propozițiile cu aceeași formulă ca oracolul. Kitul nu e atins: filtrarea se face în linie.
10. **WinError 32 / raport oricum**:
    - `sterge()` reîncearcă de 3 ori, apoi folosește `ignore_errors`;
    - dosarele temporare pentru `claude -p` au `ignore_cleanup_errors=True`;
    - mutarea `t1` → `t1_anterior` nu mai poate opri rularea;
    - fiecare treaptă e prinsă: o treaptă care crapă devine o problemă care blochează, cu motivul;
    - detaliile unei trepte fără date nu mai opresc scrierea raportului.

    Proba e `_calibrare\proba_rmtree.py`: un dosar cu fișier deschis nu aruncă, iar T0 forțat să crape cu `PermissionError 32` dă raport scris, cu „T0 s-a oprit cu o eroare”. PROBA TRECUTĂ. Proba a prins întâi o scăpare reală: `scrie_raport` crăpa pe o treaptă fără detalii. Am reparat-o.
11. *(găsit pe drum)* **Vocabularul viitor din materialele cursului** (`_plan.definitii_materiale`): definițiile din `Info_Gimnaziu_2026\materiale\continut\clasa_<X>_M*.json` intră în T0 ca termeni ai lecțiilor viitoare (prudent, doar ale lecțiilor de după). Fără asta, T0 nu știa că „aliniere”/„indentare” sunt lecția 6 a clasei a VII-a, deci n-ar fi prins defectul (a). Programa numește „aliniere” doar la a VIII-a (Excel).
12. *(găsit pe drum)* **Sarcinile pe pași date ca „walkthrough”**: la prima rulare T1 nouă, generatorul a dat pașii cu acțiune drept `walkthrough`, iar codul meu îi scotea pe toți. Au rămas doar 3 exerciții, deci o probă prea subțire. Am oprit rularea (nu i-am luat rezultatul în seamă). Acum scriptul scoate doar parcurgerea întregii lecții, iar promptul cere `exercitiu` pe fiecare pas cu acțiune.
13. *(găsit pe drum)* **Rădăcina comună cu lecția de azi**: pe VII nr. 5 (proba de robustețe), „selecția” era luată drept vocabularul lecției 13 („Selecția unor secvențe audio…”), deși lecția 5 predă chiar selectarea. Un termen viitor de un singur cuvânt cu aceeași rădăcină ca un termen al lecției de azi nu mai intră în glosar.
14. *(găsit pe drum)* **Teach-back LIPSA la 2 cititori, pe un obiectiv pe care lecția îl predă** (`confirma_obiective`): la prima rulare T1 nouă pe VII, ambii cititori au lăsat pe dinafară „cum decide ce obiect să folosească, după ce vrea să afle cititorul”. Lecția spune exact asta la pasul 2 («Alegi obiectul după ce vrei să afle cititorul: să vadă cum arată ceva → imagine; …»), cu 4 exerciții. Am încercat mai întâi o regulă mecanică de suprapunere a cuvintelor. Nu deosebește: obiectivul NEpredat „a formata un obiect” iese 0,62, cel predat 0,67, iar unul absurd („sistem de operare”) 0,50. Ar fi făcut linia oarbă, așa că am renunțat la ea. În loc, un obiectiv LIPSA la ≥ 2 cititori e căutat de un cititor SEPARAT, cu citat și cu momeală. Dacă îl găsește (FACUT, citat valid), devine avertisment („poate nu e destul de vizibil”). Dacă nu, blochează. Proba în ambele sensuri e `_calibrare\proba_confirmare.py` (0,17 USD): obiectivul predat → FACUT, cu citatul din pasul 2; „a formata un obiect” → **NU_GASESC**, deci rămâne blocant. PROBA TRECUTĂ. La `--refa-raport`, confirmarea doar se recitește (fără cost).
15. *(găsit pe drum)* **Vocabularul lecțiilor următoare, mai vizibil pentru cititori**: profilul le dă acum doar cuvintele următoarelor 6 lecții (la VII: formatare, aliniere, indentare, spațiere…), nu ~40 din tot anul. Parcurgerea cere explicit ca astfel de cuvinte să fie trecute la `blocaje`. T0 verifică în continuare tot glosarul. Motivul: copia (a) nu a fost semnalată de T1 (vezi mai jos).

## Rezultatele, în detaliu

### V nr. 4
- `--fara-t1` (`_calibrare\rezultate\v-original-fara-t1\`): S0 TRECUT, S1 TRECUT, S2 5/6 (83%) TRECUT, T0 0. **0 care blochează.**
- `--refa-raport` (`v-m1-l04\raport.md`; T1 recitit din rularea veche, fără cost): T1 = 2 (kitul spunea 8):
  - S-1 (parcurgere) nu se mai numără: a căzut doar pe atelier, întrebarea 4 și laborator;
  - cele 3 teach-back LIPSA sunt avertismente (un singur cititor);
  - „structura generală” și „componentelor” sunt citate doar din antet.

  **Rămân S-4 și S-7.** Cauza stă în textul sarcinilor scrise de promptul VECHI: sarcina însăși îi spune cititorului „dacă lecția nu spune ce se întâmplă pentru acest exemplu, scrie NEFACUT”. Recitirea nu poate repara asta. Promptul nou nu mai permite clauza (reparația 6), dar efectul se vede doar la o generare nouă. T1 pe V n-a fost cerut.

### VII nr. 4
- `--refa-raport` pe rularea veche: **0** (kitul spunea 6). „grilă” a trecut la avertisment (propoziția care o introduce, sarcina FACUT), la fel cele 2 teach-back LIPSA (un singur cititor), iar S-8 rămâne NESIGUR, nenumărat.
- T0: textul alternativ scos, deci „paragrafe” nu mai e „folosit înainte”, iar densitatea antetului (3 propoziții) e doar avertisment. Glosarul are acum „aliniere”, „indentare”, „formatare” ca termeni ai lecției 6.
- T1 nou, haiku, rularea finală (`vii-m1-l04\raport.md`, 6,8 min, 1,17 USD): **0**. Kitul a dat 2: „obiect”/„obiecte”, citate doar din antet („Afli din ce obiecte e făcut un document…”), deci nu blochează. Au fost 11 sarcini: câte una pe pașii 2-6, atelier, provocare, plus parcurgerea și 2 teach-back-uri. Toate au ieșit FACUT. Canarul a fost citit corect, momeala n-a fost găsită.
- T1 nou, rularea 1 (`_calibrare\rezultate\vii-original-t1-rularea1_raport.md`, 1,22 USD): 1. A fost teach-back LIPSA la 2 cititori, pe regula de alegere a obiectului, care e predată la pasul 2. E alarmă falsă: de aici a pornit reparația 14, iar `proba_confirmare.py` arată că acum ar fi fost avertisment.
- O rulare anterioară, oprită de mine după generator (reparația 12, doar 3 exerciții), nu intră în socoteală.

### VIII nr. 4
- `--fara-t1` (`_calibrare\rezultate\viii-original-fara-t1\`): **0**. Densitatea antetului (6 propoziții) e avertisment.
- `--refa-raport` pe rularea veche: **0** (kitul spunea 4). Cele 4 blocaje din propoziția pasului „La ce folosește” sunt citate doar din acel pas. În plus, cuvintele sunt acum „știute” în profil (predate în V-19, VI-5, VII-5).

### Copiile cu defect (VII nr. 4)
- (a) `a_termen-fara-t1`: T0 = 2, „[nedefinit nicăieri] aliniere” și „indentare”, cu originea „lecția viitoare 6 („Formatarea textului și a paragrafului”)”. **T1 NU l-a prins, de două ori:**
  - rularea 1 (`a_termen-t1-rularea1\`): T1 = 0. Niciun cititor n-a pomenit cele două cuvinte, iar numărul kitului a fost 1 („obiecte”, din antet). Filtrele mele n-au ascuns nimic, pentru că nu era nimic de ascuns;
  - rularea 2 (`a_termen-t1\`), după reparația 15: T1 = 1, dar blocajul e **S-7 NEFACUT pe provocare, fals**. Cititorul spune că lecția nu arată cum pui poza între propoziții și text, însă provocarea o spune la pasul 5: «Dă clic la capătul ultimei propoziții despre pisici și apasă Enter: ai un rând gol deasupra lui „Ce mănâncă:”… Inserare (Insert) › Imagini». Același text a ieșit FACUT în rularea finală pe original.

  Deci defectul (a) e prins de **T0**, treapta deterministă a regulii 1. Cititorii haiku nu îl prind: „aliniere” arată ca un cuvânt obișnuit.
- (b) `b_recun-fara-t1`: S2 PICAT, „aplicare/execuție 2 din 6 (33%) < 50% pe „Încearcă” + atelier”. Pașii 3, 4 și 5 sunt recunoaștere cu acoperire 100%. T0 = 0.
- (c) `c_identic-fara-t1`: S1 PICAT 1, „Î1 = P2 Încă un exercițiu 1 … (același text și același răspuns)”. test_joc a dat și el FAIL IDENTIC (S0 „PICAT 0”, fiindcă identicele se numără o singură dată, la S1).

## Proba de robustețe pe lecții necalibrate (`_calibrare\rezultate\alte_lectii\`, `--fara-t1`)
Linia rulează fără erori pe V-5, VI-4, VII-5 și VIII-5. Aceste semnalări **NU sunt triate** de mine, deci le trec ca „de triat”, nu ca adevăruri:
- VI-4, T0: „imagini importate” „nedefinit nicăieri”. Lecția scrie „(„imagine importată”)” în paranteză, formă pe care oracolul nu o recunoaște ca definiție, deci probabil e limita kitului;
- VII-5, T0: „anulează” e folosit în pasul despre selecție înainte de pasul care îl marchează;
- VIII-5, T0: „virgulă” e folosit („scrise cu virgulă”) înainte de pasul care o marchează ca termen.

## Limite (ce linia încă NU știe)
- **T1 (cititorii haiku) nu prinde vocabularul viitor care arată ca un cuvânt obișnuit** (copia a: ratat de 2 ori, chiar cu profilul restrâns și cu instrucțiunea explicită). Pentru regula 1, paza e T0. Cuvintele viitoare pe care T0 nu le are în glosar (vezi mai jos) nu le prinde, practic, nimeni înainte de judecător (J).
- **T1 mai dă, rar, câte un NEFACUT fals**: 1 din ~20 de sarcini în cele 2 rulări finale (S-7 pe copia a, pe un text care a ieșit FACUT pe original). Linia nu-l poate deosebi mecanic de unul adevărat, pentru că citatul e valid. Reparația posibilă ar fi „a doua părere”: un NEFACUT se numără doar dacă îl confirmă un al doilea cititor. Nu am făcut-o, pentru că scade sensibilitatea la defectele pe care le vede un singur cititor. E o decizie de luat (mai puține alarme false sau mai multă sensibilitate), nu o reparație evidentă.
- **Felul exercițiului pe conținut e o euristică de cuvinte, nu de înțeles.** O sortare care parafrazează definițiile cu alte cuvinte poate ieși „aplicare” (VII P2 varianta 2 iese aplicare, trierea spune recunoaștere). Un diagnostic al cărui răspuns e numele unei piese din text iese „recunoaștere” (V P5 „Încearcă”, trierea spune „aplicare la limită”). Pe „Încearcă” + atelier, V și VII ies ca în triere, dar lecțiile cu mai multe exerciții „cu variante” sunt mai expuse.
- **Excepția „propoziția care introduce termenul”** se bazează pe îngroșare. Un termen al lecției de azi, îngroșat într-o instrucțiune din textul pasului și neexplicat, trece ca avertisment dacă cititorul a terminat totuși sarcina. Vocabularul lecțiilor viitoare nu intră sub excepție.
- **T0 prinde vocabularul lecțiilor viitoare doar dacă e în programă sau în blocurile `definitii` ale materialelor.** Un cuvânt al unei lecții viitoare, nedefinit acolo, trece de T0 și rămâne în grija cititorilor T1.
- **Un termen viitor ÎNGROȘAT e luat de oracol drept definiție** (`**X**` = definiție în `oracol_novice._regex_definitie`). Defectul (a) l-am plantat fără îngroșare, cum ar arăta o scăpare. Dacă ar trebui schimbat ceva în kit: ca `**X**` să conteze ca definiție doar dacă e urmat de o explicație în aceeași propoziție. Asta e de făcut în kit, nu în linie.
- **Kitul taie propoziția la punctul dintre ghilimele** („…registru.” în titlul lecției 2). Linia ocolește asta la antet (fără verdict sub 10 propoziții), dar reparația adevărată e în `oracol_novice.verif_densitate` (kit).
- **Un LIPSA la teach-back confirmat de 2 cititori costă un cititor + un notator în plus** la fiecare rulare (~0,05-0,15 USD).
- V nu a avut T1 nou (cum s-a cerut). Efectul promptului nou asupra S-4/S-7 de la V se vede abia la rularea T1 a lecției V.

---

## Stratul 2 (27.09.2026, seara): blocaj citat doar din TITLUL pasului (VII nr. 6)

**Ce a semnalat dirijorul:** pe VII nr. 6, T1 a blocat 3 termeni citați din titlul pasului care îi predă: «Alinierea» din „Pasul 5: Alinierea paragrafului”, «Alineatul» și «Spațierea dintre rânduri» din „Pasul 6: Alineatul și spațierea dintre rânduri”. Titlul anunță ce se predă chiar acum. Nu e o folosire înainte de explicație.

**Regula aplicată** (`verifica_lectie.py`, `_t1_detalii`, funcția `_din_titlu`): un blocaj nu se numără, și rămâne avertisment ca la antet, dacă sunt adevărate toate condițiile de mai jos:
- TOATE citatele lui stau doar în titlul unui pas (`## Pasul i: …` = câmpul `t`);
- același text nu apare și în corpul lecției;
- fiecare cuvânt de conținut al termenului apare în textul ACELUIAȘI pas (text, „Uite cum”, „Explică-mi altfel”; fără exercițiile pasului);
- termenul nu e vocabularul unei lecții viitoare (regula 9).

Dacă măcar un citat vine din altă parte, blocajul se numără, cu acel citat.

**Rezultatul pe VII nr. 6** (`vii-m1-l06\raport.md`, `--refa-raport` la 19:19, fără cost, pagina neschimbată în timpul rulării, amprenta `3be8bfe218…`):
- înainte: T1 = 3 elemente care blochează. Două sunt cele 3 termeni din titlu («Alineatul» și «Spațierea dintre rânduri» erau deja numărați o dată, fiind aceeași propoziție). Al treilea e un teach-back. Raportul vechi e păstrat în `_calibrare\rezultate\vii-m1-l06_raport_inainte_titlu.md`;
- după: **T1 = 1**. Cei 3 termeni din titlu apar acum ca avertismente („citat DOAR din titlul pasului 5/6, iar termenul e explicat în textul aceluiași pas”);
- elementul care rămâne NU ține de titlu: teach-back LIPSA la 2 cititori pe «Elevul poate spune de ce alinierea, alineatul și spațierea se aplică unui paragraf … doar cu cursorul». Cititorul de confirmare a dat NU_GASESC, deși a citat «Alinierea e a întregului paragraf: ajunge un clic în el, fără selecție.». Pasul 5 spune regula doar pentru aliniere. La pasul 6, pentru alineat și spațiere, lecția spune doar „dai clic în paragraf”, fără „de ce”. **E de triat, nu l-am decis eu:** poate fi un gol real (regula nu e spusă explicit pentru alineat/spațiere) sau o confirmare prea strictă.

**Proba că regula nu orbește linia** (`_calibrare\proba_titlu.py`, pe verdictele reale ale rulării VII-6, fără cost). **PROBA TRECUTĂ.**
- A. Originalul: cei 3 termeni din titlu → avertisment, niciunul nu blochează.
- B. Negativ: titlul pasului 5 devine „Alinierea și indentarea paragrafului”, iar un cititor blochează pe «indentarea» citând titlul. Textul pasului 5 nu explică indentarea, deci blocajul **se numără**.

  (În B mai apare «Alinierea» cu citat gol: citatul original al cititorului nu mai există în titlul schimbat. Un blocaj fără citat valid rămâne numărat, adică linia e prudentă.)

**Defectele plantate, din nou, la treptele gratuite (`--fara-t1`, după regula nouă):**

| Copia | Rezultat | Prins? |
|---|---|---|
| `control` | 0 | nimic de prins, corect |
| `a_termen` | T0 PICAT 2 („aliniere”, „indentare” nedefinite nicăieri) | **da, la T0** |
| `b_recun` | S2 PICAT 1 (2 din 6, 33%) | **da, la S2** |
| `c_identic` | S1 PICAT 1 (Î1 = P2 Încă un exercițiu 1) | **da, la S1** |

Regresie pe lecțiile nr. 4 (`--refa-raport`): V rămâne 2 (S-4/S-7, sarcinile vechi, vezi mai sus), VII 0, VIII 0. Nimic nu s-a schimbat față de stratul 1.

**Limita nouă:** regula verifică doar că termenul APARE în textul pasului, nu că e cu adevărat explicat acolo. Un pas intitulat „Indentarea” care doar pomenește cuvântul („apoi faci indentarea”), fără să spună ce e, trece ca avertisment. Paza pentru cazul acesta rămâne T0 (definiție după tipare) și judecătorul (J).
