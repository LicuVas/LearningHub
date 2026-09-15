# Evaluare independentă: „Antrenament: Prezentări” (VI-U1), 15.09.2026

Jocul: `C:\00\Projects\LearningHub\jocuri\prezentari-antrenament-vi\index.html`. Doar acest fișier a fost modificat.
Copia de dinainte: `index_inainte.html`. Dovezi: `joaca.txt` (bazine, tragere reală, simulator pe 2 telefoane), `bazine.json`, `capturi\`, `surse\` (paginile Microsoft aduse cu curl + `extrage.py`).

## Sursele
- Pagini de eroare („Error - Office.com”), NEfolosite: `eval_V_VI_VII\surse\ppt_fundal.txt`, `ppt_ordine_obiecte.txt` (confirmat). Și ghicirile mele de URL care au dat eroare le-am șters.
- Bune și folosite: `VI\surse\ms_expunere_scurtaturi_ro.txt`, `ms_creare_scurtaturi_ro.txt`, `ms_tranzitie_temporizare_ro.txt`, `eval_V_VI_VII\surse\ppt_prezentator.txt`.
- Aduse de mine (ro-ro, curl): `surse\dublare.txt` („Adăugarea, rearanjarea și ștergerea diapozitivelor”), `fonturi.txt` („Avantajele încorporării fonturilor particularizate”), `pdf.txt` („Salvarea sau conversia la PDF…”), `anim_multi.txt` („Aplicarea mai multor efecte de animație la un obiect”), `tranz.txt`, `notes.txt`; plus `learn_formate.txt` (Microsoft Learn, engleză, „File format reference”).

## Cele 5 fapte pe care autorul nu le-a putut verifica
| Fapt | Rezultat | Ce am făcut |
|---|---|---|
| .ppsx pornește direct în modul prezentare | **verificat** pe Microsoft Learn (EN): „.ppsx PowerPoint Show — A presentation that always opens in Slide Show view”. Pagina ro-ro n-am găsit-o (motoarele de căutare blocate, GUID-uri necunoscute). | păstrat; enunțul precizează „pe calculatorul lui cu PowerPoint” (o întrebare Microsoft Q&A are titlul „PowerPoint Show (*.ppsx) does not work in online PowerPoint?”; conținutul n-am citit) |
| exportul PDF pierde animațiile | **nedovedit** pe sursă (pagina PDF nu spune nimic despre animații) | formulat prudent: „PDF-ul e făcut pentru citit și tipărit, nu pentru expunerea cu efecte” (2 locuri) |
| font lipsă pe alt calculator strică aspectul | **verificat** `fonturi.txt`: „dacă partajați documentul cu o altă persoană care nu are instalate aceleași fonturi… fonturile, aspectul și stilul documentului [s-ar] modifica” | păstrat; remediul „salvând o copie PDF” (nedovedit) înlocuit cu „Încorporare fonturi în fișier” (Fișier, Opțiuni, Salvare), citat din sursă |
| „Dublare” / „aliniere” în PowerPoint ro | „**Dublare diapozitiv**” verificat (`dublare.txt`). „Aliniere”: nu am găsit pagina; întrebarea spune generic „comenzile de aliniere a obiectelor”, nu un nume de buton | păstrate |
| bara de stare arată numărul diapozitivului | **nedovedit** pe Microsoft (doar lecția LearningHub L1: „slide-ul curent (ex: Slide 3 din 10)”) | why formulat „arată **de obicei**… (de exemplu „3 din 12”)” |

Alte fapte verificate pe sursă: număr + Enter în expunere; săgeata stânga = „animația anterioară sau diapozitivul anterior”; Home = primul diapozitiv; Esc încheie; nici F9, nici Ctrl+9 nu apar printre scurtăturile expunerii; „La clic”, „**Cu anteriorul**”, „După precedentul”; „La clic de mouse”, „După” (secunde), „Se aplică pentru toate”; notele nu se văd de public; Shift + clic = șir de diapozitive, Ctrl + clic = unul câte unul; PDF prin Salvare ca / Export. Zoom-ul: python-pptx arată că mărirea stă în `ppt/viewProps.xml` (proprietăți de vizualizare), nu în diapozitive.

## Semnalări și reparații
| # | Gravitate | Ce | Reparat |
|---|---|---|---|
| 1 | important | **Nume greșit de interfață**: „Cu precedentul”. În PowerPoint ro e „Cu anteriorul” (`anim_multi.txt`). | da, în variantă și în why |
| 2 | important | **Dublură cu jocul de învățare**: Consolidat „Profesorul arată în PowerPoint… tu în Google Slides” = `prezentari-vi` N1 „Colegul lucrează în Google Slides… cele mai multe operații se fac la fel” (aceeași idee; scriptul n-a prins-o). În plus, varianta bună era cea mai lungă (67 față de 44-54). | înlocuită cu o întrebare nouă, lecția 2: zoom-ul din bara de stare ≠ mărimea fontului |
| 3 | important | **Dublură în aceeași rundă**: De bază match „Salvare ca… → copie PDF” + order „copie PDF… Salvare ca…” (+ `prezentari-vi` N2 tf „Salvare ca… alt format”). | perechea schimbată pe „Expunere → le arăți colegilor pe tot ecranul” (conținut de gestionare din programă, neacoperit altfel în rundă) |
| 4 | important | **Dublură între runde**: tf De bază „ai grupat… se mută toate” = choice Avansat „hartă + etichete → grupezi”. | tf-ul din De bază scos (Avansat păstrat, v. „la limită”) |
| 5 | important | **Runda greșită + dublură**: tf Avansat „o tranziție rezolvă cerința ca lista să apară pe rând” (un adevărat/fals cu o idee) repeta în aceeași rundă întrebarea „planta: intrare la clic”. | înlocuit cu choice nou lecția 7 pe specificație: stand care rulează singur (După 8 s + Se aplică pentru toate) |
| 6 | important | **Runda greșită**: order Consolidat „muți o imagine: selectezi, Ctrl + X, treci, Ctrl + V” = pași ghidați (De bază) și dublură cu clasificarea De bază „Copiezi sau muți? (Ctrl + X, apoi Ctrl + V)”. | scos; lecția 5 din Consolidat primește o întrebare nouă: șirul 4–7 ales cu Shift + clic (vs Ctrl + clic, Ctrl + A) |
| 7 | important | **Runda greșită**: choice Consolidat „sari la diapozitivul 9” = rechemare de scurtătură. Varianta bună era și cea mai lungă (27 față de 14-18). | mutat în De bază; distractori reechilibrați (Esc apoi 9 / Ctrl + 9 apoi Enter / Home apoi 9) |
| 8 | minor | Scurgere prin formă: „O legătură spre diapozitivul 5” (30 car., repetă enunțul) față de „Un sunet” (8). | variante scurte egale: legătură / tranziție / animație / sunet |
| 9 | minor | Scurgere: planta, „Câte o animație de intrare pe fiecare desen, la clic, în ordinea creșterii” (78) față de 47-56. | toate 42-43 de caractere |
| 10 | minor | Scurgere: „Spui sincer că nu știi și că vei căuta” (38) față de 24-31. | distractori 35-41 |
| 11 | minor | Vânătoarea Vlad (Avansat) avea 3 din 4 greșeli identice ca idee cu „Planul lui Andrei” din `prezentari-vi` N8 (text mult, tranziții diferite, fără surse); indiciul enumera exact cele 4 locuri. | punctul „o singură tranziție” schimbat în „text de cel puțin 24” (greșeala: „scriu textul cu 16”); indiciu general |
| 12 | minor | Săgeata stânga: why-ul nu spunea că întâi se întorc animațiile (sursa MS). | adăugat |
| 13 | minor | „Joi, 12 martie” — în 2027, 12 martie e vineri. | „Joi, 11 martie” |
| 14 | minor | Order PDF: „Salvare ca…” nu există cu PDF în toate aplicațiile (în PowerPoint sursa MS dă și Export). | „Salvare ca…” sau „Export” |
| 15 | minor | Textul „Amintește-ți” din Consolidat vorbea de copiere/mutare, care nu mai e în rundă. | rescris: aliniere + Shift + clic |

Toate cheile celor 45 de întrebări inițiale le-am citit: **nicio cheie greșită**, fiecare cu o singură variantă bună; why-urile explică; niciun indiciu nu numește litera (verificat și mecanic).

## Potrivirea cu descriptorul
Din 45: **4 în runda greșită** (#5 tf în Avansat, #6 order ghidat în Consolidat, #7 scurtătură în Consolidat; plus #2 recunoaștere în Consolidat, înlocuită). La limită, lăsate:
- Avansat „hartă + etichete → grupezi”: aplicare cu o constrângere, mai aproape de Consolidat. L-am lăsat ca lecția 5 să aibă 2 întrebări în Avansat (altfel poarta avertizează că lecția se epuizează la reluare).
- Consolidat „.ppsx”: alegerea unui format după nevoie, aproape de rechemare.
- Consolidat „un coleg te întreabă ceva ce nu știi”: evident pentru un copil de a VI-a.

## Dubluri parțiale, lăsate pentru profesor
- Consolidat classify „Primul / La mijloc / Ultimul” ≈ `prezentari-vi` N3 order „părțile unei prezentări”;
- Consolidat classify formate (PDF pentru tipărit/site) ≈ N2 „profesorul doar citește → .pdf”;
- Consolidat hunt Rareș (notele văzute de public) ≈ N1 tf „publicul vede notele” și N7 tf prezentator; bara de stare apare și în De bază Q1;
- Avansat match „aplici aceeași temă” ≈ N5 „aceleași culori pe 12 diapozitive → temă”;
- Avansat „stand, După 8 s” ≈ N7 classify „cum avansează (hol = automat)” și Consolidat classify „Se aplică pentru toate”;
- simulatorul Avansat are aceeași schemă ca N5 „Mihai” și N8 „șahul” (cu specificație în plus).

## Tragerea (iPhone SE, runde TERMINATE, fără toateIntrebarile)
- După reparații: De bază 16 (6 trase), Consolidat 15 (6), Avansat 13 (5); toate ≥ 2×cate. Lecții pe rundă: fiecare lecție declarată are ≥ 2 întrebări.
- Reluarea după o rundă terminată: **0 repetate** în toate 3 rundele; la a treia jucare ciclul reîncepe (2-3 repetate, normal).
- Prima tragere: 6/7 lecții în De bază și Consolidat (maximum posibil cu 6 întrebări), 5/5 în Avansat.
- Abandonul nu consumă (4-5 din 6 comune la repornire).

## Simulatorul `diapozitiv` (clicuri reale, iPhone SE 320px și Pixel 7 412px, 22 de cazuri × 2)
- `gresit()` **respins la toate cele 3 diapozitive** (galben pe alb / fundal alb cerut închis / fundal bleumarin cerut deschis); `rezolva()` acceptat la toate.
- Clasa I: roșu pe alb cu 2 rânduri și negru pe gri cu 3 rânduri = acceptate; rând de 5 cuvinte, alb pe portocaliu, nimic scos = respinse.
- Planetele: alb pe bleumarin 36/26 = acceptat; alb pe gri, roșu pe bleumarin, titlu 28, text 44 = respinse.
- Târgul de carte: negru pe alb cu 3 rânduri și roșu pe alb cu 4 = acceptate; alb pe bleumarin, text 16, 2 rânduri, gri deschis pe alb = respinse.
- Pagina nu e mai lată decât ecranul; 0 erori JS. Mesajele numesc problema exactă.

## Declarațiile rundelor
Adevărate după mutări (verificat pe `lectii` din bazin, `joaca.txt`): De bază și Consolidat [2..8], Avansat [5..9]. Conținuturile declarate au fiecare cel puțin o întrebare (tranziția din Avansat e acum întrebarea „standul”, fiindcă tf-ul și fragmentul cu tranziții din vânătoare au ieșit).

## Porțile, la final
- `test_joc.py prezentari-antrenament-vi` → **[TRECUT]**, 88 de întrebări jucate, 64,1 diacritice/1000, **fără avertismente** (după o primă rulare cu avertismentul „lecția 5 are 1 întrebare în Avansat”, rezolvat);
- `acoperire.py` → **0 goluri, 0 probleme de declarare**;
- `intrebari_unitate.py VI-U1 --verifica` → **0 perechi** (41 existente, 44 în joc).

## Rămâne de decis de profesor
- Dublurile parțiale de mai sus: repetiție voită sau întrebări noi?
- Mărimea textului: jocul cere 24 (De bază) și „cel puțin 26” în specificații; materialul spune 24–28, lecția LearningHub „sub 18pt” (contradicție deja cunoscută).
- Numele din laborator (Brauner): „Cu anteriorul” / „După precedentul”, „Se aplică pentru toate”, „Încorporare fonturi în fișier” sunt din paginile Microsoft ro actuale; pe un Office vechi pot diferi.
- „Bara de stare arată numărul diapozitivului” și „PDF fără animații” rămân nedovedite pe sursă Microsoft (formulate prudent).
- Cele 3 întrebări „la limită” de descriptor.
