# LearningHub: verificare „la sânge” și refacere, lecție cu lecție

Coduri: **S** = script (program care verifică singur) · **R** = aplicația reală (Excel, Word...) · **A** = agentul „dumb” (un model AI care citește ca un începător) · **J** = judecătorul (alt model, care n-a scris nimic) · **O** = omul (Vasile). „Nivel” = o lecție pe pași din /jocuri/. Haiku, Sonnet, Opus = modele AI, de la cel mai ieftin la cel mai scump. „Proba” = situl de probă, proba.learninghub-8z6.pages.dev.

## 1. Ce am măsurat

| Cifra | Ce înseamnă | De unde |
|---|---|---|
| 9 | constatări pe lecția de Excel din 27.09 (cls8/m2-formule-functii/lectia1); tastat cum cere lecția, Excel-ul real dă #VALUE! în loc de 600 | analiza din 27.09 + proba în Excel |
| 420 din 462 | exerciții „Încearcă” din pașii jocurilor sunt de recunoaștere (alegi o variantă, potrivești, ordonezi); doar 35 se fac în simulator, toate în cele două jocuri de Excel. 13 din cele 15 jocuri cu pași n-au niciun „Încearcă” în simulator | numărat azi (tipuri_incearca.py), jocuri/*/index.html |
| ~141 | niveluri pe pași în 19 jocuri, plus 8 jocuri de antrenament și recapitulare | jocuri/, catalog.js |
| 191 din 192 | formule la care simulatorul Excel dă ce dă Excel-ul real | oracol_excel |
| 739 | probleme confirmate în auditul din 03.09: 54 blocante, 123 majore, 562 minore, pe 503 pagini | confirmate.json |
| 89% / 94% | cât a prins verificarea „hibrid v3” pe 25 de lecții (probleme importante / care schimbă ora), cu 4 alarme false | auditul 03-04.09 |
| 0,47 USD, 2-3 min | 8 sarcini + 1 notare făcute de agentul-începător (model Haiku) | proba T1 |
| 660 / 335 / 143 | lecții pe sit / lecții TIC vechi de gimnaziu / lecții în planul de gimnaziu (25 de unități) | harta sitului, unitati.json |
| 159 și 819 | fișiere .html care promit „de la zero”, respectiv „vei ști / vei învăța / vei putea” | grep pe tot situl, azi |
| 0 | etichete în română în panglicile simulate (niciun câmp „ro” în panglica-excel/word/powerpoint.json; toate numele sunt cele din Office în engleză). Panoul clasei (data/panou/lectii.json) trimite încă, la toate cele 7 intrări, la lecțiile vechi din content/tic, nu la jocuri | panglica-*.json, data/panou/lectii.json |

## 2. Ce trebuie să facă situl

1. Elevul care pornește de la zero ajunge să facă singur, în aplicația adevărată, lucrul promis, nu doar să răspundă la întrebări despre el.
2. Puțin text, un pas = o idee, imagine reală sau simulare la fiecare acțiune, exerciții făcute chiar în pagină.
3. De la general la complex: întâi „la ce folosește”, apoi câte un singur lucru nou pe exercițiu.
4. Nicio indicație nu contrazice alta și nici aplicația reală (Office în română și în engleză, „;” sau „,”).
5. Ordinea de pe sit e ordinea orelor tale; „lecția de azi” e un link sigur, pe sit și pe panou.

## 3. Mașina de verificat

Șase niveluri. Orice comandă tipărește pe ultima linie un singur număr (0 = trece). Fiecare amănunt e în fișierul separat **lista_verificare.json**: 46 de rânduri pe lecție (L01-L36, cu sub-rânduri „b/c”), 17 pe unitate, 24 pe sit.

| Nivel | Cine | Ce verifică | Dovada | Când trece |
|---|---|---|---|---|
| 0. Poarta statică, gratuită | S: verif_lectie.py (NOU), test_joc.py, ilustratii.py, prereq_jocuri.py, oracol_novice.py | locul în plan; forma pașilor; nimic folosit înainte de a fi predat (nici în indicii); practică față de chestionar; imagini care arată altceva decât textul (citite prin OCR = program care citește textul din poze); nume RO/EN; constante; salturi de dificultate | raport_n0.jsonl, tabla_scoruri.csv | nivel nou: 0 abateri; lecție veche: doar scor |
| 1. Executorul în pagină | S: Playwright (browser condus de program) pe 2 telefoane emulate | face acțiunile lecției și ale agentului strict ca un elev: celula se confirmă doar cu Enter, Tab sau clic; butoanele „Copiază”; răspunsuri greșite tipice și ce indiciu primesc; soluția stricată trebuie să pice | executor/…/log.jsonl | 0 nepotriviri |
| 2. Aplicația reală (arbitrul) | R: Excel, Word, PowerPoint pornite invizibil prin COM (automatizarea Office din Windows) și închise fără salvare; g++ (C++); Chromium (HTML); scratch-vm (Scratch); un dosar real (Explorer) | rezultatul promis, pe RO și EN; fiecare afirmație „dacă faci X, apare Y”; greșelile firești ale novicelui; simulator = aplicație; la algoritmi, stările pas cu pas | aplicatie_reala.json | 0 divergențe; fără arbitru, cel mult „verificat parțial” |
| 3. Agentul dumb | A: un apel pe pas, dosar tăiat mecanic (secțiunea 4) | poate un începător face fiecare pas numai din ce i s-a spus? unde a găsit informația? | pasi.jsonl, validare.txt | 0 probleme, pe profil RO și EN, rulare validă |
| 4. Judecătorul | J: Opus care n-a scris lecția | încearcă să respingă semnalările grave (un blocaj se respinge NUMAI arătând locul unde termenul e explicat înainte); reverifică 20% din pașii „făcut”; faptele de informatică au sursă; atacă porțile cu muncă falsă | judecator.json | 0 grave confirmate și nereparate |
| 5. Omul | O: Vasile | profilul claselor; OK la prima publicare a unei unități; 10 minute de privit la clasă pe unitate | stare_lectii.json, nota_observare | fără OK-ul tău nimic nu intră în producție |

Insigne: **verificat** = nivelurile 0-4 trecute și bancul (secțiunea 8) trecut; **verificat parțial** = bancul netrecut, aplicația fără arbitru sau numele RO ale meniurilor neconfirmate; **nerevizuit** = restul. După orice reparație se reiau nivelurile 0-3, inclusiv imaginile.

## 4. Agentul care urmează lecția pas cu pas

**Ce primește.** Un dosar construit de program (dosar_dumb.py):
- numai ce vede elevul la pasul k (text, exemplu, enunț, celule, imagini); lecția e tăiată exact după pasul k;
- caietul: lecțiile anterioare din plan (gol, dacă lecția promite „de la zero”);
- profilul clasei (ce ȘTIE, ce NU ȘTIE). Cuvintele din NU ȘTIE și meniurile din cealaltă limbă devin cuvinte inventate („TVA” → „zorvel”) până unde lecția le explică, ca agentul să nu aducă din afară ce știe;
- ecranul ca grilă, variantele amestecate; indiciul și rezolvarea doar DUPĂ prima încercare;
- nicio unealtă de căutare.

Un test de scurgere rulează înaintea oricărui apel: dacă în dosar apare o bucată de 12 caractere din ce trebuia ascuns, nu pornește niciun agent.

**Cum i se fac sarcinile.** Nicio sarcină nu o scrie autorul lecției.
- Scriptul face câte o sarcină pe fiecare pas, exercițiu, atelier, întrebare și pe provocarea din diplomă (cu Office RO și cu EN). Pe paginile vechi ia comenzile („Scrie”, „Apasă”), atribuirile „A1 = …” și rezultatele promise.
- EXECUȚIE (lecția dictează ce tastezi) sau APLICARE (răspunsul nu e scris; agentul arată regula și exemplul din care l-a dedus, scriptul refă calculul). Sub jumătate APLICARE = „dictare”, nivelul pică.
- Un generator independent desface frazele cu mai multe acțiuni, face din fiecare „dacă faci X, apare Y” o probă în aplicația reală și scrie întrebări de înțelegere din programă, nu din pas.
- Drumul celui care greșește: executorul dă un răspuns greșit tipic; agentul trebuie să ajungă la răspuns doar din indiciu.
- Fiecare întrebare se pune și fără lecție; dacă agentul răspunde corect și așa, întrebarea nu dovedește nimic.
- Parcurgeri întregi: nivelul pe aceeași foaie; unitatea, la poarta ei.

**Ce răspunde la FIECARE pas** (format fix):
- acțiunile, dintr-o listă fixă (selectez, tastez, apăs Enter, clic pe textul butonului, trag, copiez, lipesc...) și, dacă instrucțiunea se poate înțelege în mai multe feluri, toate lecturile (cel mult 3);
- **unde am găsit informația**, pentru fiecare acțiune: *lecția curentă* (pasul + citat exact) / *lecția X anterioară* (pasul + citat) / *imaginea Y* (ce se vede) / *nicăieri* → NU_GĂSESC. Citatul are cel puțin 12 caractere;
- ce aștept să apară (cu citat) sau „lecția nu spune”;
- știu ce să fac? văd unde? înțeleg ce s-a întâmplat? (ultima e o predicție verificată de executor: „dacă A2 devine 10, ce apare în C2?”); ce e nou față de pasul dinainte.

Verdictul îl pune scriptul: FĂCUT, FĂCUT_CU_INDICIU, FĂCUT_FĂRĂ_ÎNȚELEGERE, NEFĂCUT, CONTRADICȚIE, BLOCAJ, NU_GĂSESC, NESIGUR.

**Regulile de carte închisă.** (1) Ce e în dosar e tot ce știi. (2) Faci literal ce scrie, unde scrie (exemplu inventat: „în B3 scrie Total: 12” → tastezi „Total: 12” în B3). (3) Dacă se poate citi în mai multe feluri, le scrii pe toate. (4) Nicio acțiune fără citat. (5) Cuvânt folosit înainte de explicație → BLOCAJ, apoi mergi mai departe. (6) Două citate opuse → CONTRADICȚIE; nu alegi tu. (7) Nu spui ce a ieșit în aplicație; asta o scrie executorul. (8) Exercițiul îl faci din enunț, rezolvarea o deschizi după. (9) Fără fapte din afara lecției, fără sfaturi.

**Validatorul** (valideaza_pas.py; un script, deci nu poate fi convins):
- citatul există în dosar (se normalizează doar spațiile), iar ce faci (celula, textul, butonul, tasta) e în citat sau la cel mult 40 de caractere de el;
- un citat doar din „ecran” nu se primește; unul din altă lecție, doar dacă lecția aceea e trimisă din „Ai nevoie de”;
- tabelul „acțiune → ce trebuie să știi”: „=A1*B1” cere „=” și „*” predate; „SUM(E2:E4)” cere SUM și „:”. Dacă lipsesc înainte de pas, scriptul pune BLOCAJ, orice ar spune agentul;
- FĂCUT numai dacă executorul a rulat acțiunile și ecranul arată promisiunea; celula rămasă în editare = NEFĂCUT;
- o celulă cu alt rol, fără „foaie nouă” scris între cele două folosiri, dă CONTRADICȚIE automat;
- pe cel puțin 30% din apeluri, o perturbare secretă („canar”): un număr schimbat (agentul trebuie să urmeze copia) sau o promisiune ștearsă (un număr care nu e în dosar invalidează apelul); plus o momeală (buton inexistent) care trebuie să primească NU_GĂSESC;
- problemele se reiau cu alt agent; cele pe care judecătorul nu le confirmă se numără NESIGUR, nu dispar.

**Cele 9 constatări din 27.09 → cine le prinde**

| # | Constatarea | Cine o prinde |
|---|---|---|
| 1 | „A1 = Cantitate: 5”, tastat literal | A tastează literal; R: #VALUE! în loc de 600; S: niciun avertisment înainte |
| 2 | „,” în formule, zecimale cu punct, meniuri doar în engleză | R refuză pe RO; S: nume fără pereche; A (profil RO) nu găsește butonul |
| 3 | D1 e întâi TVA, apoi rezultatul 540 | foaia ținută de script → CONTRADICȚIE; J decide |
| 4 | „protecția #DIV/0!” fără împărțire | S: n-are „/”; R: fără IF dă 0, nu eroare |
| 5 | „fiecare formulă are o eroare”; rezerva 0 față de „N/A” | R: una refuzată, alta dă 106; S verifică și indiciile |
| 6 | 6 coloane cerute, 5 în rezolvare | S numără; A compară; R construiește tabelul |
| 7 | „nu de la stânga la dreapta” și „de la stânga la dreapta” | S: fraze opuse → A: CONTRADICȚIE; J |
| 8 | TVA 19% | S: constante_lume.json = 21% de la 01.08.2025 (Legea 141/2025, verificat azi pe sursă; fișa noastră: knowledge/contabil_profesie/40 - Domenii tehnice/TVA.md); agentul e orb aici, prin construcție |
| 9 | „=” folosit înainte de explicație; „Copiază” ia și comentariile | S pune BLOCAJ; executorul citește ce s-a copiat |

## 5. Cum se reface o lecție

**Modelul.** Lecția N din unitatea U = un nivel pe motorul jocurilor; pagina de citit se generează din același conținut, deci nu se mai pot contrazice. Ordinea: antet → „la ce folosește” → 3-5 pași (explicație, „Uite cum”, „Încearcă”) → atelier în simulator → „Acum în aplicația adevărată” → 5 întrebări → „Ce am învățat”.

**Exemplu: lecția din 27.09, refăcută ca VIII-U1 nr. 7 „Formule de calcul”**
1. Antet: conținuturile copiate din programă; obiectiv: „Scrii o formulă care calculează din alte celule.” Ai nevoie de: nr. 4 (adresa celulei), nr. 5 (tipuri de date).
2. O singură dată: „Pe unele calculatoare scrii ; între argumente, pe altele , — îți dăm mereu ambele forme.”
3. Pasul 0, fără acțiuni: poza unui bon de cumpărături. „Excel înmulțește și adună singur; tu scrii doar regula.”
4. Pasul 1, foaie nouă anunțată: „În A1 scrie cuvântul Cantitate. În A2 scrie doar numărul 5, fără cuvinte, și apasă Enter.” Captură reală.
5. La fel: B1 „Preț”, B2 120.
6. Pasul 2: „O formulă începe cu =. Semnul * înseamnă înmulțire.” Uite cum: în C2 scrii =A2*B2, apeși Enter, apare 600; captura arată exact asta.
7. Încearcă (execuție): aceeași formulă, în simulatorul din pagină.
8. Încearcă (aplicare): „Pe rândul 3: 4 caiete a câte 7 lei. Calculează în C3.” Formula nu e scrisă nicăieri.
9. Pasul 3: „Schimbă A2 în 10. Ce crezi că apare în C2?” Elevul prezice, apoi vede.
10. Pasul 4, o singură frază: „Excel face întâi * și /, apoi + și –; între operații de același fel merge de la stânga la dreapta.”
11. TVA nu apare aici; vine în lecția cu procente, cu 21%.
12. Atelier: 3 cerințe = 3 teste numite care se bifează.
13. În Excel-ul adevărat: „Pornire (Home)”, ce trebuie să vezi, cum salvezi.
14. Indiciile trec prin aceleași verificări ca textul; cheile întrebărilor despre efecte sunt verificate în Excel.

## 6. Ordinea lucrurilor

**Ancora e pe disc, nu la autor.** Gimnaziu: unitati.json (ordinea), curriculum.json (programa OMEN 3393/2017), planificările și Calendar_ore_*.md (datele). Liceu și postliceal: curriculum_liceu.json (NOU: patru programe copiate cuvânt cu cuvânt, cu pagina: TIC 5099/2009, maiștri 4760/2006, AMF 2006, AMG 2026), unitati_liceu.json din vault, datele din planificările .docx, fără săptămânile de practică. Tupilați: Calendar_ore_Tupilati.md (NOU), cu două rânduri la ora simultană 6/7.

**Și ordinea se verifică.** unitati.json spune singur că ordinea e „decizia profesională a profesorului”. În faza 4, orice lecție care folosește ce se predă mai târziu intră în ordine_audit.md cu două variante: pas de pregătire sau mutare (decizia 6). De verificat: VIII nr. 4 (copiere) înainte de nr. 5 (introducerea datelor); VII nr. 31 (rulare pas cu pas) după șase lecții de programe; VI nr. 24 (blocuri grafice) după structurile repetitive.

**Ce se mută.** Word de a VII-a pus la a V-a și „siguranță-backup” → arhivă cu bandă; web-ul de la a VII-a → VIII-U2; șirurile de la a VII-a → VIII-U3; bazele de date → liceu (X, maiștri, farmacie); dublurile de Excel (m1/m2) și HTML (m3/m4) se topesc în nivelurile unității.

**Ce se aruncă.** Fizic doar cls8/extra-materiale-suplimentare (gol). Restul rămâne public cu banda „nerevizuit — lecția din plan e aici”; când nivelul nou trece poarta, adresa veche trimite automat la el. Progresul elevilor, diplomele și evidența activității nu se rup.

**Înainte de a despărți nivelurile**, fiecare nivel și fiecare întrebare primesc un nume stabil (nu un număr de ordine), cu un tabel de trecere pentru rezultatele deja salvate; banca testelor și jocurile de antrenament și recapitulare se regenerează după fiecare publicare. Panoul clasei ia linkul din Calendar_ore, nu din lista scrisă de mână.

**Cum se verifică.** Pe unitate: U02 (navigarea), U03 (nimic folosit înainte), U07 (parcurgerea continuă, fiecare blocaj pus „de ordine” sau „de lecție”), U11b (pornirea de la general). Pe sit: S01 (harta), S04 și S04b (progresia și cazurile nedecise), S06 și S06b (lecția de azi, panoul).

## 7. Fazele

| Faza | Ce se face | Ce produce | Poarta de ieșire | Durata | Agenți | Cine |
|---|---|---|---|---|---|---|
| 0. Urgența (27.09 seara → 29.09, 08:00) | proba de publicare; banda „nu o folosi” pe lecția din 27.09; panoul pe săptămână; lecția nr. 4 la toate clasele, cu uneltele existente; Delete, mutare, copiere rulate în Excel; raportul practică/chestionar; termenele tale în calendar | bandă, „nivelul de azi” pentru 28.09-02.10, cel mult „verificat parțial” | 0 grave; pagina descărcată de pe proba are semnul versiunii noi; OK-ul tău | o seară; agenții ~10-15 min (extrapolat din T1) | ~5 sonnet, ~40 sarcini Haiku, 1-3 opus | Claude; tu: Tupilați + OK |
| 1. Calibrarea (28.09-04.10) | profile precompletate (V-VIII, X, maiștri, AMF); glosarul VIII-U1; TVA din TVA.md; meniuri RO din două surse; programele de liceu; carta sitului | fișiere cu sursă și dată | OK-ul tău pe profile | agenți ~20 min (extrapolat din verificarea cu 16 agenți în 10 min); tu ~70 min (estimat) | 6-8 | tu aprobi |
| 2. Bancul (noaptea 28→29.09) | copia sitului din 03.09; lecția din 27.09 înghețată; 748 de etichete; mutanți sigilați | banc.json, banc_masina.py | ≥45 din 50 de etichete confirmate de judecător | o noapte (extrapolat) | 15-30 sonnet, 1 opus, 1 autor de mutanți | nesupravegheat |
| 3a. Mașina comună + Excel (29.09-03.10) | nivelurile 0-3, validatorul, dosarul mascat, OCR; atacul; bancul | mașina; cost și timp măsurate | pragurile din decizia 7; atacul eșuează; max. 3 runde | 3-4 nopți (estimat) | 2-3 sonnet, 1-2 opus, ~10-15 rulări Haiku (~5-7 USD, extrapolat) | Claude |
| 3b. Ceilalți arbitri (până la 10.10) | Word, PowerPoint, Scratch, Explorer; fișe pentru Paint, poștă, browser; panglici RO; proba de captură ascunsă | arbitri cu probe | 0 divergențe | 3-5 nopți (estimat) | 2-3 sonnet + 1 opus | Claude |
| 4. Structura (01-06.10) | harta; meniuri generate; bandă pe lecțiile vechi; nivelurile 0-1 pe 660 de lecții; auditul ordinii; nume stabile; fișe în vault | traseul nou pe proba; tabla de scoruri | rândurile S de structură; OK-ul tău | 1-2 nopți; 660 de lecții ~11 min (extrapolat) | ~10 + 16 la final | Claude; tu: OK |
| 5. Pilotul „calcul tabelar” (din 02.10) | VIII nr. 5 (gata 03.10), nr. 7 (17.10), nr. 3 și 6 noi; X, maiștri, AMF | niveluri live; cifre reale | rândurile L la prag; OK până la 05.10; bancul netrecut → „parțial” + un adversar în plus | 02-05.10 pentru nr. 5 (extrapolat) | pe nivel: 1 autor, ~14 sarcini Haiku (~0,8-1 USD, extrapolat), 1-3 opus | Claude; tu: OK + 10 min la clasă |
| 6. Loturile săptămânale (08.10 → iunie) | ce se predă în 14 zile + avans; liceu; Modulul 1 AMG nou până la 31.01.2027 | lecții live cu dovezi | fereastra_calendar.py = 0 | o noapte pe lot; 20-30 niveluri/noapte (extrapolat din campania 02-03.09, fără capturi) | 60-100 pe val (extrapolat), în plafonul din decizia 8 | agenți; tu: OK |
| 7. Simulatoare de mecanism | urmărire pas cu pas pentru V-U5, VI-U3, VII-U4, VIII-U3; Access; „unde e comanda” | simulatoare comune | stările = execuția reală; gata cu 14 zile înainte | ~o noapte fiecare (estimat) | 2-3 sonnet + 1 opus | Claude |
| 8. Poarta de unitate | rândurile U; hibrid v3 + atacator; bucla de critici până la 2 runde goale | raportul unității | U01-U15; OK; observarea | 18-20 min pe rundă (măsurat) × ≥2 | 15-30 | agenți; tu |
| 9. Întreținerea | bancul lunar, fereastra zilnic, constantele la 90 de zile | istoric | verde la pornire | minute/săptămână (estimat) | 0 de obicei | mecanic |
| 10. Închiderea anului (mai-iunie 2027) | rândurile S pe tot situl | raport final | 0 lecții din plan fără „verificat” | 1-2 nopți (extrapolat) | ~20 | tu: arhiva |

## 8. Bancul de test al mașinii

Mașina nu pune „verificat” până nu trece bancul. Bancul se îngheață ÎNAINTE de construcție, iar constructorul nu-l vede.
- **B0**: lecția din 27.09, copie înghețată. Prag: 9 din 9, cu dovadă.
- **M, mutanți ascunși**: alt agent pune câte un defect în bucăți curate, pe fiecare rând din listă, plus capcanele găsite de critici: captura rămasă în urmă; indiciul care trimite greșit; „Delete pe A1 dă #REF!” (fals, cu o întrebare potrivită minciunii); lecția-dictare; explicația aflată doar în „Explică-mi altfel”; Enter lipsă; „Google Sheets sau Excel”; pas de acțiune doar cu chestionar. Prag: 100%.
- **C, controale curate**: cel mult 4 alarme false la 25 de lecții curate.
- **B1-B3**: cele 739 de probleme din 03.09, pe copia sitului salvată în git înainte de reparații (commitul 147b684a), etichetate dinainte de alți agenți. Praguri: 54 din 54 blocante; ≥90% din 123 majore; ≥70% dintr-un eșantion fix de 100 minore.
- **P, precizia**: din 50 de semnalări grave ale mașinii, doi judecători confirmă ≥80%.
- **A, atacul**: muncă falsă, dovadă din alt dosar, citat care nu susține acțiunea, citat doar din ecran, perturbare ignorată, momeală „găsită”. Toate respinse.
- **K, calibrarea modelului**: un model nou găsește măcar blocajele cunoscute găsite de cel vechi.
- **Contaminarea**: dacă o bucată de peste 20 de caractere din banc apare în instrucțiunile agenților sau în mesajele regulilor, rezultatul se anulează.
- **Excluderile**: un judecător sortează ratările; la tine ajunge doar ce se vede numai la clasă, pe o pagină, duminica. Nesemnat = ratare; peste 15 cereri = bancul pică.

Minimul: cât a prins hibridul v3 pe aceleași lecții. Comanda: banc_masina.py, reluată după orice schimbare și lunar.

## 9. Deciziile tale

1. **Mâine, 28.09, la Tupilați**: ce clasă, ce lecție, după ce planificare? La ora simultană 6/7, cui explici tu? *Recomandare:* îmi spui diseară, primești linkul până dimineață; clasa care lucrează singură primește nivelul cu cele mai puține blocaje la agent, iar când vor exista, numai niveluri „verificat”. *Alternative:* nu schimbăm nimic mâine; doar niveluri de joc.
2. **Un singur conținut.** *Recomandare:* pagina de lecție se generează din nivel; o lecție din plan = cel puțin un nivel. *Alternative:* lecții HTML separate (se pot contrazice); fără pagini de lecție.
3. **Ce văd elevii până la refacere.** *Recomandare:* nivelul de joc cu banda „în revizie”; lecțiile vechi publice cu bandă; insigne publice. *Alternative:* ascundem lecțiile vechi (se rup linkurile); fără insigne.
4. **Ordinea de lucru și liceul.** *Recomandare:* fereastra de 14 zile obligatorie; în avans „calcul tabelar” pe VIII, X, maiștri, AMF; din liceu doar grupele tale. *Alternative:* clasă cu clasă V→VIII; cele mai slabe întâi.
5. **„De la zero” pe clasă.** *Recomandare:* ȘTIE = ce a predat planul în anii dinainte, minus ce bifezi tu că lipsește; un profil pe clasă. *Alternative:* zero absolut (lecții lungi); exact planul anterior (riscant).
6. **Ordinea greșită din planificare.** *Recomandare:* pas mic de pregătire în lecție, planificarea depusă rămâne. *Alternativă:* mutăm lecția și refacem planificarea.
7. **Când acceptăm mașina.** *Recomandare:* pragurile din secțiunea 8. *Alternative:* mai lax; mai strict, 94% (întârzie începerea).
8. **Ce am voie noaptea.** Câți agenți din abonament (limita e aceeași pe care o folosești ziua) și, dacă proba pe desktopul ascuns pică, pot face capturi pe ecranul vizibil? *Recomandare:* un plafon fixat de tine; consumul îl vezi duminica; capturi noaptea cu un acord dat o singură dată. *Alternative:* fără plafon; capturi doar într-o fereastră de zi.

## 10. Ce rămâne pe mâna ta

Varianta anterioară îți cerea, după numărătoarea criticilor, peste 120 de intervenții (~35-45 de ore pe an, estimat). Acum: tot ce ai de aprobat vine într-un singur ecran, duminica la 20:00; raportul de dimineață pleacă doar când e ceva pentru tine; OK-ul îl dai pe Telegram („/ok VIII-U1”, „/nu VIII-U1 motiv”, „/obs VIII-U1 ce ai văzut” — receptorul de comenzi e NOU; azi telegram.py doar trimite); termenele tale intră în Google Calendar. Plafon: 60 de minute pe săptămână după prima săptămână (rândul S20). Nimic din tabel nu e măsurat încă.

| Ce | Cât de des | Timp (estimat) |
|---|---|---|
| Tupilați + deciziile 1-3 | diseară | ~20 min |
| OK pe bandă și pe nivelurile nr. 4 | până marți, 08:00 | ~15 min |
| Profilele claselor, precompletate | o dată, până la 04.10 | ~70 min |
| Glosarul unei unități (doar diferențele) | duminica dinaintea unității | ≤10 min |
| OK la prima publicare (~35 pe an), încercat pe telefon | ~săptămânal | ~15 min |
| Privit la clasă, o lecție pe unitate | în ora obișnuită | 10 min |
| Reconectarea contului Microsoft, când cere | rar | câteva minute |

Sincer: agenții nu simulează un copil. Mașina verifică dacă lecția SE POATE face din ce scrie în ea și dacă spune adevărul despre aplicație. Dacă un copil de a V-a chiar înțelege, vezi numai tu, la clasă.

## 11. Riscuri

| Risc | Semnal | Parare |
|---|---|---|
| Ora de săptămâna asta rămâne pe material vechi | fereastra_calendar.py > 0 | lotul de urgență; nivelul de joc cu bandă, niciodată pagină pe jumătate |
| Loturi verificate de o mașină netestată | banc_masina.py > 0 | cel mult „verificat parțial” + un adversar în plus |
| Mașina învață testul pe de rost | 9/9, dar mutanții sau B2/B3 sub prag | mutanți sigilați; poarta de contaminare |
| Agentul umple golurile din ce știe | canarele pică; 0 blocaje pe lecția din banc | cuvinte mascate, perturbări pe apel, blocaje puse de script, proba fără lecție |
| Dosarul scurge răspunsul | testul de scurgere > 0 | listă albă; variante amestecate; nu pornește niciun agent |
| Agentul e prea zgomotos | > 4 alarme false la 25 de lecții curate | reluare cu alt agent; judecătorul; profil recalibrat |
| Word, PowerPoint, Scratch fără arbitru la timp | insigne „parțial” în fereastră | faza 3b; lista „parțial” îți e arătată separat |
| OCR-ul nu citește româna | probă pe o captură RO | pachetul de limbă verificat în faza 3a; până atunci OCR doar pe cifre și formule |
| Office cere conectare noaptea | proba de pornire pică | mesaj pe Telegram atunci; lotul continuă fără nivelul 2, cel mult „parțial” |
| Porțile verzi, copiii tot se împotmolesc | ce vezi la clasă | cazul devine rând în NU ȘTIE și mutant nou |
| Date despre minori | orice câmp cu nume sau amprentă | doar numere pe pas, până la avizul /legal |
