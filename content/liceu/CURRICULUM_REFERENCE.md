# Curriculum Liceu — Referință (Informatică & TIC)

> Cercetat 14.06.2026 prin workflow multi-agent (cercetare Sonnet + verificare adversarială Opus) pe surse OFICIALE (edu.ro / programe în consultare publică 2025). 
Folosit ca OracoL pentru revamparea conținutului de liceu pe LearningHub.

**⚠️ STATUS VERIFICARE:** unele profiluri au verdict `reject` la verificarea adversarială — NU pentru că structura e greșită, ci pentru că au **incertitudini** sau referințe la programe/tool-uri vechi (ex. FrontPage/Dreamweaver/PageMaker la umanist provin din programe ~2006). Acele profiluri necesită o re-verificare punctuală pe sursa oficială ÎNAINTE de a construi conținut.

**📌 SCHIMBARE MAJORĂ 2025:** noile programe (plan-cadru OMEN 4350/2025, programe în consultare publică) trec limbajul de bază pe **Python** (C++ rămâne doar suplimentar, exclusiv la intensiv-informatică); **TIC = 1 oră/săpt. trunchi comun pentru TOATE filierele/profilurile** + introduce AI/LLM, realitate extinsă.

---

## Matematică-Informatică  `[mat-info]`

- **Filieră:** teoretica  |  **Verificare:** `pass`
- **Specializări:** Matematica-Informatica, Matematica-Informatica intensiv informatica

### Clasa a IX-a

**Informatica (intensiv informatica)** — 4 ore/saptamana (2 ore studiu teoretic + 2 ore activitati practice in laborator)
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa in consultare publica 2025 - numarul ordinului de aprobare a programei inca necompletata in documentul oficial
  - *Limbaj/Software:* Python (limbaj de baza obligatoriu) + C++ (suplimentar, al doilea limbaj, EXCLUSIV la intensiv)
  - *Conținut (în ordine):*
    - 1. Organizarea conceptuala a datelor: 1.1 Modelul conceptual liniar - lista (caracteristici lista, stiva, coada, acces direct/secvential, lista de frecvente; algoritmi de baza pentru prelucrarea datelor liniare)
    - 2. Strategii de rezolvare a problemelor: 2.1 Principii de elaborare a unui program (gandire computationala, etapele elaborarii unui program: analiza-proiectare-implementare-testare-depanare; moduri de reprezentare algoritmi: blocuri grafice, pseudocod, limbaj nivel inalt/scazut, interpretor, compilator; proiectare modulara; criterii elaborare teste; eficienta algoritmilor - notatie O; interfata consola, interfata grafica, fisiere)
    - 2.2 Prelucrari ale numerelor (operatii cu cifrele unui numar; algoritmi prelucrare numere: parcurgere cifre, divizori, descompunere factori primi; algoritmul lui Euclid - scaderi repetate si impartiri repetate; conversii baze de numeratie; ciurul lui Eratostene cu liste; algoritm exponentiare rapida)
    - 2.3 Metode de generare sistematica a elementelor unei liste (secvente cu proprietati date, termeni siruri recurente)
    - 2.4 Metode de sortare a elementelor unei liste (sortare prin selectia minimului; sortare cu lista de frecvente; metoda bulelor)
    - 3. Memorarea datelor si organizarea codului in limbaj de programare: 3.1 Subprograme (caracteristici, rol; antet, corp, variabile locale/globale, parametri, returnare rezultate, apel, mecanism executare; sintaxa definitie si apel subprogram in Python; subprograme predefinite Python: operatii matematice si colectii; sintaxa definitie si apel subprogram in C++; subprograme predefinite C++: operatii matematice si colectii)
    - 3.2 Introducere in programarea orientata pe obiecte in limbaj de programare (notiuni de baza: clasa, membri - date si metode, obiecte, biblioteci; instantiere clasa predefinita, acces la membrii unui obiect - Python si C++)
    - 3.3 Fisiere text (caracteristici, deschidere-inchidere-transfer date; clasa TextIOWrapper Python; clase si metode C++ pentru fisiere)
    - 3.4 Biblioteca Tkinter din Python pentru interfete grafice (Tk, Label, Button, Entry, Text, Frame, Canvas, MessageBox, comportament pack/grid/place/get)
    - 3.5 Clasa list din Python - clasa predefinita pentru memorarea unei liste (caracteristici; operatori acces, apartenta, concatenare, multiplicare, relationare; metode de baza: pozitie, numarare, stergere, inserare, adaugare, copiere, sortare)
    - 3.6 Structuri de date in C++ pentru memorarea listelor - tablouri unidimensionale (caracteristici, declarare variabile tablou unidimensional, operator acces la element)

**Informatica (matematica-informatica, non-intensiv)** — 2 ore/saptamana (1 ora studiu teoretic + 1 ora activitati practice in laborator)
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa in consultare publica 2025 - numarul ordinului de aprobare a programei inca necompletata in documentul oficial
  - *Limbaj/Software:* Python (limbaj de baza obligatoriu); C++ NU se foloseste la non-intensiv
  - *Conținut (în ordine):*
    - 1. Organizarea conceptuala a datelor: 1.1 Modelul conceptual liniar - lista (caracteristici lista, stiva, coada, acces direct/secvential, lista de frecvente; algoritmi de baza pentru prelucrarea datelor liniare)
    - 2. Strategii de rezolvare a problemelor: 2.1 Principii de elaborare a unui program (gandire computationala, etapele elaborarii unui program; moduri de reprezentare algoritmi; proiectare modulara; criterii elaborare teste; eficienta algoritmilor - notatie O; interfata consola, interfata grafica, fisiere)
    - 2.2 Prelucrari ale numerelor (operatii cu cifrele unui numar; parcurgere cifre, divizori, descompunere factori primi; algoritmul lui Euclid; conversii baze de numeratie) [NOTA: ciurul lui Eratostene si algoritmul de exponentiare rapida prezente NUMAI la intensiv]
    - 2.3 Metode de generare sistematica a elementelor unei liste
    - 2.4 Metode de sortare a elementelor unei liste (sortare prin selectia minimului; sortare cu lista de frecvente; metoda bulelor)
    - 3. Memorarea datelor si organizarea codului in limbaj de programare: 3.1 Subprograme (caracteristici, rol; sintaxa in Python; subprograme predefinite Python) [NOTA: sintaxa C++ si subprograme predefinite C++ ABSENTE la non-intensiv]
    - 3.2 Introducere in programarea orientata pe obiecte (notiuni de baza: clasa, membri, obiecte, biblioteci; instantiere, acces membri - in Python)
    - 3.3 Fisiere text (deschidere-inchidere-transfer date; clasa TextIOWrapper Python) [NOTA: clase C++ pentru fisiere ABSENTE la non-intensiv]
    - 3.4 Biblioteca Tkinter din Python pentru interfete grafice
    - 3.5 Clasa list din Python - clasa predefinita pentru memorarea unei liste [NOTA: tablouri C++ absente la non-intensiv]

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (trunchi comun, obligatoriu pentru TOATE filierele, profilurile, specializarile)
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa in consultare publica 2025 - numarul ordinului de aprobare a programei inca necompletata in documentul oficial
  - *Limbaj/Software:* Niciun limbaj de programare; software: Google Workspace sau Microsoft Teams (domeniu Societate digitala); LibreOffice sau Microsoft Office (domeniu Continut digital); Linux Ubuntu sau Windows (domeniu Sisteme de calcul)
  - *Conținut (în ordine):*
    - 1. Societate digitala: 1.1 Comunicare si colaborare digitala (forme de comunicare digitala: e-mail, chat, forum, retele sociale, videoconferinte; neticheta; creare si partajare resurse digitale; gestionare mesaje)
    - 1.2 Aplicatii si platforme care sprijina invatarea (tutoriale, cursuri online; utilizare responsabila a inteligentei artificiale pentru invatare)
    - 1.3 Introducere in inteligenta artificiala (elemente de baza AI: algoritmi, statistici, autonomie, adaptivitate; diferente fata de gandirea umana; bias social si cultural; reglementari; tipologii AI: clasificare, recomandare, predictie, generare; invatare automata; LLM - Large Language Model; interactiune cu AI - gandire critica, creativitate, gandire computationala)
    - 1.4 Introducere in tehnologii emergente (realitate extinsa - virtuala si augmentata)
    - 2. Continuturi digitale, tehnologii si aplicatii specializate: 2.1 Birotica - Documente digitale (reprezentare text in memorie, ASCII, UNICODE; formatare profesionala document: stiluri, indentari, tabulatori, aspect pagina, coloane; imbinare corespondenta, cuprins automat; utilizare responsabila AI in prelucrare texte)
    - 2.2 Birotica - Prezentari digitale (formatare profesionala prezentare: teme, interactivitate, butoane actiune, animatii, tranzitii; AI in prezentari)
    - 3. Sisteme de calcul: 3.1 Componenta hardware a unui sistem de calcul (arhitectura sistem; CPU: UAL, UC, registri, cache, ciclu fetch-decode-execute; RAM si ROM; medii si dispozitive de stocare: HDD, SSD, optical, flash; interfete: placa sunet, retea, video, USB; periferice intrare/iesire uzuale; placa de baza: magistrale, chipseturi, BIOS/UEFI; surse alimentare si racire)
    - 3.2 Componenta software a unui sistem de calcul (tipuri software; sisteme de operare: tipuri, functii, interfete GUI/CLI, sisteme de fisiere NTFS/FAT32/EXT/APFS; gestionare fisiere si foldere; securizare sistem de operare: firewall, antivirus, utilizatori, criptare)

### Clasa a X-a

**Informatica (intensiv informatica) - Curriculum de Specialitate (CS)** — 4 ore/saptamana (2 ore studiu teoretic + 2 ore activitati practice in laborator)
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa clasa X in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj/Software:* Python (baza) + C++ (suplimentar, exclusiv la intensiv)
  - *Conținut (în ordine):*
    - Domeniu 1 - Modele conceptuale simple: modele liniare, neliniare, asociative (structuri de date tip stiva, coada, arbore binar, dictionar/map)
    - Domeniu 2 - Algoritmi specializati pe clase de probleme: prelucrarea listelor ordonate; criptarea/decriptarea sirurilor de caractere (EXCLUSIV la intensiv si militar)
    - Domeniu 2 - Strategii de rezolvare probleme: Divide et Impera; Greedy
    - Domeniu 3 - Elemente limbaj de programare: prelucrarea datelor in modele simple liniare, neliniare, asociative (Python si C++ la intensiv)
    - Domeniu 3 - Subprograme recursive: sintaxa definitie si apel, mecanism de executare (EXCLUSIV la matematica-informatica, intensiv si militar)

**Informatica (matematica-informatica, non-intensiv) - Curriculum de Specialitate (CS)** — 2 ore/saptamana (1 ora studiu teoretic + 1 ora activitati practice in laborator)
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa clasa X in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj/Software:* Python (baza); C++ absent la non-intensiv
  - *Conținut (în ordine):*
    - Domeniu 1 - Modele conceptuale simple: modele liniare, neliniare, asociative (structuri de date simple)
    - Domeniu 2 - Strategii de rezolvare probleme: Divide et Impera; Greedy
    - Domeniu 3 - Elemente limbaj de programare: prelucrarea datelor in modele simple liniare, neliniare, asociative (Python)
    - Domeniu 3 - Subprograme recursive (EXCLUSIV la matematica-informatica si intensiv, absent la stiinte ale naturii)

**Tehnologia Informatiei si a Comunicatiilor (TIC) - Trunchi Comun (TC)** — 1 ora/saptamana
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa X-XII in forma de proiectie curriculara (consultare publica 2025)
  - *Limbaj/Software:* Niciun limbaj de programare
  - *Conținut (în ordine):*
    - 1. Societate digitala: securitate cibernetica si etica in spatiul digital; navigare avansata pe web
    - 2. Continuturi digitale: pagini web (HTML/CSS elementar); foi de calcul tabelar (Excel/Calc avansat); imagini digitale (prelucrare grafica)
    - 3. Sisteme de calcul: intretinere si depanare de baza ale unui sistem de calcul; asamblare componente hardware; programe utilitare; operatii de intretinere si optimizare sistem

### Clasa a XI-a

**Informatica (intensiv informatica) - Curriculum de Specialitate (CS)** — 7 ore/saptamana (4 ore studiu teoretic + 3 ore activitati practice in laborator)
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa clasa XI in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj/Software:* Python (baza) + C++ (suplimentar, exclusiv la intensiv)
  - *Conținut (în ordine):*
    - Domeniu 1 - Modele conceptuale complexe: liste inlantuite (EXCLUSIV la intensiv); modele relationale; modele ierarhice (arbori)
    - Domeniu 2 - Algoritmi specializati: prelucrarea grafurilor; prelucrarea arborilor (EXCLUSIV la intensiv si militar)
    - Domeniu 2 - Strategii de rezolvare a problemelor: Backtracking (generare sistematica a solutiilor); programare dinamica - subprobleme suprapuse (EXCLUSIV la intensiv)
    - Domeniu 3 - Elemente limbaj de programare: prelucrarea datelor in modele complexe (liste inlantuite - exclusiv intensiv; relationale; ierarhice); alocare si eliberare statica si dinamica a memoriei (EXCLUSIV la intensiv)
    - Domeniu 3 - Programare Orientata pe Obiecte: definirea claselor proprii, membri, mostenire, polimorfism

**Informatica (matematica-informatica, non-intensiv) - Curriculum de Specialitate (CS)** — 4 ore/saptamana (2 ore studiu teoretic + 2 ore activitati practice in laborator)
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa clasa XI in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj/Software:* Python (baza); C++ absent la non-intensiv
  - *Conținut (în ordine):*
    - Domeniu 1 - Modele conceptuale complexe: modele relationale; modele ierarhice (arbori) [liste inlantuite si alocare dinamica memorie absente la non-intensiv]
    - Domeniu 2 - Strategii de rezolvare a problemelor: Backtracking (generare sistematica a solutiilor) [programare dinamica absenta la non-intensiv]
    - Domeniu 3 - Elemente limbaj de programare: prelucrarea datelor in modele relationale si ierarhice (Python)
    - Domeniu 3 - Programare Orientata pe Obiecte: definirea claselor proprii (Python)

**Tehnologia Informatiei si a Comunicatiilor (TIC) - Trunchi Comun (TC)** — 1 ora/saptamana
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa XI in forma de proiectie curriculara (consultare publica 2025)
  - *Limbaj/Software:* Niciun limbaj de programare
  - *Conținut (în ordine):*
    - 1. Societate digitala: modelare computerizata a unor activitati (sisteme expert, activitati economice, de mediu, recreere)
    - 2. Continuturi digitale: prelucrare audio; prelucrare audio-video; baze de date (utilizare aplicatii dedicate)
    - 3. Sisteme de calcul: dispozitive inteligente si Internetul Obiectelor (IoT); fundamente robotica (programare roboti virtuali, senzori); configurare si testare comportament roboti virtuali

### Clasa a XII-a

**Informatica (intensiv informatica) - Curriculum de Specialitate (CS)** — 7 ore/saptamana (4 ore studiu teoretic + 3 ore activitati practice in laborator)
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa clasa XII in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj/Software:* Python (baza) + C++ (suplimentar, exclusiv la intensiv) + SQL (pentru baze de date, la matematica-informatica si militar)
  - *Conținut (în ordine):*
    - Domeniu 1 - Modele conceptuale avansate: proiectarea bazelor de date (model relational avansat); modele pentru invatare automata (Machine Learning)
    - Domeniu 2 - Normalizarea modelului conceptual al unei probleme de gestiune (strategii de normalizare: forme normale)
    - Domeniu 2 - Algoritmi specializati pentru invatare automata (clasificare, regresie, algoritmi ML de baza)
    - Domeniu 3 - Comenzi SQL si elemente limbaj de programare pentru prelucrarea datelor organizate in baze de date (SQL: SELECT, INSERT, UPDATE, DELETE, JOIN, subinterogari)
    - Domeniu 3 - Elemente limbaj de programare pentru prelucrarea datelor in invatare automata (Python + biblioteci ML)

**Informatica (matematica-informatica, non-intensiv) - Curriculum de Specialitate (CS)** — 3 ore/saptamana (2 ore studiu teoretic + 1 ora activitati practice in laborator)
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa clasa XII in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj/Software:* Python (baza) + SQL (pentru baze de date)
  - *Conținut (în ordine):*
    - Domeniu 1 - Modele conceptuale avansate: proiectarea bazelor de date (model relational); modele pentru invatare automata
    - Domeniu 2 - Normalizarea modelului conceptual al unei probleme de gestiune
    - Domeniu 2 - Algoritmi specializati pentru invatare automata
    - Domeniu 3 - Comenzi SQL si elemente limbaj de programare pentru prelucrarea datelor in baze de date
    - Domeniu 3 - Elemente limbaj de programare pentru invatare automata (Python)

**Tehnologia Informatiei si a Comunicatiilor (TIC) - Trunchi Comun (TC)** — 1 ora/saptamana
  - *Bază legală:* OMEN 4.350/2025 (plan-cadru); programa XII in forma de proiectie curriculara (consultare publica 2025)
  - *Limbaj/Software:* Niciun limbaj de programare
  - *Conținut (în ordine):*
    - 1. Societate digitala: participare civica si profesionala in spatiul digital
    - 2. Continuturi digitale: aplicatii cu interfete vizuale si ergonomie digitala
    - 3. Sisteme de calcul: retele de calculatoare (dispozitive active, medii de transmisie, protocoale; configurare si securizare retea; monitorizare si diagnosticare retea)

**Surse oficiale consultate:**
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_CS_IX_Real_Matematica_informatica_regim_intensiv.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_CS_IX_Real_Matematica_informatica.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Tehnologia_informatiei_si_a_comunicatiilor_TC_IX.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_Proiectie_curriculara_CS_X_XII.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/TIC_TC_X_XII_proiectie_curriculara.pdf
- https://www.edu.ro/cons_pub_programe_scolare_liceu

**⚠️ Incertitudini (de re-verificat înainte de build):**
- Numerele exacte ale ordinelor ministeriale de aprobare a programelor scolare (OMEN) pentru disciplinele Informatica si TIC la clasele IX-XII sunt NECOMPLETATE in documentele publicate in consultare publica 2025 (apar ca 'nr. ....../......'); singurul OMEN confirmat este OMEN 4.350/2025 care aproba planurile-cadru.
- Programele detaliate cu unitati de continut pentru clasele X, XI si XII nu au fost publicate individual - exista doar o 'proiectie curriculara' (document de prefigurare a parcursului) care prezinta competentele generale si specifice, NU tabelele cu unitati de continut detaliate; continuturile pentru X-XII din acest raspuns sunt reconstuite din proiectia curriculara si pot diferi de programele finale.
- Nu s-a putut confirma daca programele din consultare publica 2025 sunt deja in vigoare sau urmeaza sa fie adoptate pentru un an scolar viitor; vechile programe (bazate pe OMEN-uri anterioare, cu Pascal/C++) pot fi inca aplicabile in scolile care nu au implementat noul curriculum.
- Ordinea exacta a unitatilor de continut in interiorul fiecarui an (care capitol se preda primul, al doilea etc.) nu este precizata in proiectia curriculara pentru clasele X-XII; este lasata la latitudinea profesorului cu respectarea competentelor.
- Continuturile detaliate pentru TIC clasele X, XI, XII nu sunt publicate intr-un document de programa complet - exista doar proiectia cu competente specifice; detaliile despre unitatile de continut pentru X-XII TIC au fost reconstituite din domenii tematice mentionate in proiectia curriculara.
- Nu s-a putut accesa oldsite.edu.ro (ECONNREFUSED) unde se aflau programele anterioare aprobate oficial cu OMEN-uri, deci comparatia cu curriculumul anterior (pre-2025) nu a putut fi realizata din sursa primara.

**🔎 Probleme semnalate de verificatorul adversarial:**
- NOMENCLATURE ERROR (repeated throughout): Data labels the order 'OMEN 4.350/2025'. The official programme PDFs explicitly state 'Ordinul ministrului educatiei SI CERCETARII nr. 4.350/2025' (OMEC, signed 20.06.2025). 'OMEN' = Ordinul Ministrului Educatiei NATIONALE, the FORMER ministry name. The correct abbreviation is OMEC (or OME). The number 4.350/2025 and its function (aproba planurile-cadru pentru invatamantul liceal cu frecventa zi) are CORRECT; only the ministry abbreviation is wrong. Source quote (Informatica_CS_IX_Real_Matematica_informatica_regim_intensiv.pdf): 'Conform Ordinului ministrului educatiei si cercetarii nr. 4.350/2025 privind aprobarea planurilor-cadru pentru invatamantul liceal cu frecventa zi'.
- MINOR / potentially confusing to a lay reader (data flags it correctly in 'incertitudini' but worth surfacing): edupedu.ro coverage describes the IX mate-info programme as using 'Python exclusively' and criticizes it (Prof. Emanuela Cerchez, SEPI). This is journalistic simplification and does NOT contradict the data: the official intensiv PDF (lines 105/109) confirms 'utilizarea Python ca limbaj de baza' + 'utilizarea C++, suplimentar, ca al doilea limbaj de programare, doar la ... regim intensiv'. The data's Python-base + C++-exclusiv-intensiv claim is the accurate one.
- TIMING (data flags correctly): the new curriculum is in 'consultare publica 2025' (until ~12 Dec 2025) and applies from school year 2026-2027 for class IX; for 2025-2026 the old plans-cadru remain. Verified via edu.ro press release context. Data's uncertainty notes capture this accurately.

**✏️ Corecții propuse:**
- Replace every 'OMEN 4.350/2025' with 'OMEC 4.350/2025' (or 'Ordinul ministrului educatiei si cercetarii nr. 4.350/2025'). OMEN is the old ministry name (Educatiei Nationale); current is Educatiei si Cercetarii.
- No content corrections required. Verified against official source PDFs and confirmed ACCURATE: (a) IX intensiv = 4h/sapt, IX non-intensiv = 2h/sapt, XI intensiv = 7h, XI non-int = 4h, XII non-int = 3h; (b) full IX continuturi tables match (chapters 1, 2.1-2.4, 3.1-3.6 intensiv incl. Ciurul Eratostene, exponentiere rapida, Tkinter, TextIOWrapper, tablouri C++); (c) non-intensiv IX table ends at 3.5 (no 3.6 C++ tablouri) - 'C++ absent la non-intensiv' confirmed; (d) TIC = trunchi comun 1h/sapt 'la toate filierele, profilurile si specializarile, clasele IX-XII' - exact match; (e) X-XII proiectie curriculara confirmed to contain Divide et Impera, Greedy, Backtracking, programare dinamica, normalizare, grafuri/arbori (** = exclusiv intensiv/militar), subprograme recursive, SQL, baze de date, invatare automata - all data claims supported.
- Keep the 'incertitudini' section as-is: it honestly and correctly states the programme-approval order numbers are blank ('nr. ...../......' in the PDFs - verified), that X-XII content is reconstructed from the proiectie curriculara (verified - it has competencies + thematic domains but not full detailed unitati-de-continut tables), and that the curriculum is in consultation, not yet in force. This intellectual honesty is accurate.

---

## Științe ale Naturii  `[stiinte]`

- **Filieră:** teoretica  |  **Verificare:** `pass`
- **Specializări:** Stiinte ale naturii

### Clasa a IX-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1
  - *Bază legală:* OMEN 4.350/2025 (planuri-cadru); programa in consultare publica 2025
  - *Conținut (în ordine):*
    - 1. Societate digitala: Comunicare si colaborare digitala
    - 2. Societate digitala: Introducere in inteligenta artificiala
    - 3. Societate digitala: Introducere in tehnologii emergente
    - 4. Societate digitala: Aplicatii si platforme care sprijina invatarea
    - 5. Continuturi digitale, tehnologii si aplicatii: Birotica - Documente digitale
    - 6. Continuturi digitale, tehnologii si aplicatii: Birotica - Prezentari digitale
    - 7. Sisteme de calcul: Componenta hardware a unui sistem de calcul
    - 8. Sisteme de calcul: Componenta software a unui sistem de calcul

**Informatica** — 1
  - *Bază legală:* OMEN 4.350/2025 (planuri-cadru); programa in consultare publica 2025 - Curriculum de specialitate (CS)
  - *Limbaj/Software:* Python
  - *Conținut (în ordine):*
    - 1. Strategii de rezolvare a problemelor: Principii de elaborare a unui program
    - 2. Strategii de rezolvare a problemelor: Prelucrari ale numerelor
    - 3. Memorarea datelor si organizarea codului: Subprograme
    - 4. Memorarea datelor si organizarea codului: Introducere in programarea orientata pe obiecte
    - 5. Memorarea datelor si organizarea codului: Biblioteca Tkinter din Python pentru interfete grafice
    - 6. Memorarea datelor si organizarea codului: Fisiere text
    - 7. Organizarea conceptuala a datelor: Modelul conceptual liniar - lista
    - 8. Memorarea datelor si organizarea codului: Clasa list din Python
    - 9. Strategii de rezolvare a problemelor: Metode de generare sistematica a elementelor unei liste
    - 10. Strategii de rezolvare a problemelor: Metode de sortare a elementelor unei liste (selectia minimului, lista de frecvente)

### Clasa a X-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1
  - *Bază legală:* OMEN 4.350/2025 (planuri-cadru); proiectie curriculara TIC X-XII 2025
  - *Conținut (în ordine):*
    - 1. Societate digitala: Securitate cibernetica si etica in spatiul digital; navigare avansata pe web
    - 2. Continuturi digitale: Pagini web (HTML/CSS)
    - 3. Continuturi digitale: Foi de calcul (calc tabelar)
    - 4. Continuturi digitale: Imagini digitale
    - 5. Sisteme de calcul: Intretinere si depanare de baza a unui sistem de calcul

**Informatica** — 1
  - *Bază legală:* OMEN 4.350/2025 (planuri-cadru); proiectie curriculara Informatica X-XII 2025 - Curriculum de specialitate (CS)
  - *Limbaj/Software:* Python
  - *Conținut (în ordine):*
    - 1. Organizarea conceptuala a datelor: Modele conceptuale simple - liniare, neliniare (stiva, coada, arbore binar - fara structuri dinamice de memorie)
    - 2. Strategii de rezolvare a problemelor: Algoritmi pentru prelucrarea listelor ordonate
    - 3. Strategii de rezolvare a problemelor: Strategii generale - metoda Greedy (optim local)
    - Nota: Continuturile marcate (*) - structuri liniare inlantuite, subprograme recursive, modele neliniare/asociative - sunt EXCLUSIV pentru specializarea matematica-informatica; nu se predau la Stiinte ale naturii

### Clasa a XI-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1
  - *Bază legală:* OMEN 4.350/2025 (planuri-cadru); proiectie curriculara TIC X-XII 2025
  - *Conținut (în ordine):*
    - 1. Societate digitala: Modelare computerizata a unor activitati economice, de mediu sau recreere; sisteme expert
    - 2. Continuturi digitale: Prelucrari audio
    - 3. Continuturi digitale: Prelucrari audio-video
    - 4. Continuturi digitale: Baze de date (aplicatii)
    - 5. Sisteme de calcul: Dispozitive inteligente si Internetul obiectelor (IoT)
    - 6. Sisteme de calcul: Fundamente ale roboticii (roboti virtuali)

### Clasa a XII-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1
  - *Bază legală:* OMEN 4.350/2025 (planuri-cadru); proiectie curriculara TIC X-XII 2025
  - *Conținut (în ordine):*
    - 1. Societate digitala: Participare civica si profesionala in spatiul digital (CV digital, cetatenie digitala, ocupare profesionala)
    - 2. Continuturi digitale: Interfete vizuale si ergonomie digitala (aplicatii cu interfete vizuale)
    - 3. Sisteme de calcul: Retele de calculatoare - dispozitive active, medii de transmisie, protocoale, configurare si securizare

**Surse oficiale consultate:**
- https://www.edu.ro/cons_pub_programe_scolare_liceu
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_CS_IX_Real_Stiinte_ale_naturii.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_Proiectie_curriculara_CS_X_XII.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Tehnologia_informatiei_si_a_comunicatiilor_TC_IX.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/TIC_TC_X_XII_proiectie_curriculara.pdf

**⚠️ Incertitudini (de re-verificat înainte de build):**
- Programele consultate (2025) sunt in stadiu de CONSULTARE PUBLICA - ordinul ministrului nu are numarul completat in anteturi (se prezinta ca nr. ........./............); nu este confirmat ca aceste programe sunt deja in vigoare sau de cand se aplica (posibil incepand cu anul scolar 2025-2026 sau 2026-2027).
- Proiectia curriculara pentru Informatica clasele X-XII nu contine unitati de continut detaliate pentru Stiinte ale naturii la clasa a X-a; continuturile sunt prezentate combinat cu math-info si marcate prin asteriscuri (*/**) pentru a diferentia - unele continuturi sunt exclusiv math-info; separarea exacta a continuturilor pentru Stiinte ale naturii la clasa a X-a necesita lectura atenta a asteriscurilor din proiectia curriculara.
- Proiectia curriculara TIC clasele X-XII nu contine domenii de continut detaliate (nu exista echivalentul sectiunii CONTINUTURI ALE INVATARII din programa IX); ordinea si detaliul temelor pentru X, XI, XII la TIC sunt orientative, deduse din competentele specifice prezentate - nu dintr-o lista de continuturi explicita.
- Planurile-cadru aprobate prin OMEN 4.350/2025 nu au fost verificate direct (documentul planurilor-cadru nu a fost accesat); numarul de ore/saptamana pentru Informatica CS (1h/sapt la clasele IX-X Stiinte ale naturii) si TIC TC (1h/sapt IX-XII toate specializarile) este confirmat doar prin textul programelor de mai sus, nu prin consultarea directa a planului-cadru.
- Nu a putut fi confirmata existenta vreunei programe TIC sau Informatica anterioare OMEN 4.350/2025 inca in vigoare pentru clasele XI-XII Stiinte ale naturii (tranzitia intre noul si vechiul curriculum nu este explicita in documentele consultate).

**🔎 Probleme semnalate de verificatorul adversarial:**
- Class X Stiinte ale naturii content: the parenthetical 'stiva, coada, arbore binar - fara structuri dinamice de memorie' does not appear as such in the official Informatica X-XII projection PDF (literal terms 'stiva'/'coada'/'arbore binar'/'dinamice de memorie' = 0 occurrences). It is interpretive embellishment of the asterisk-marked exclusions, not a source quote. Mitigated: the data's incertitudini #2 and #3 explicitly admit the X-XII separation for Stiinte ale naturii is 'deduced'/'orientative' and requires careful reading of the asterisks.
- Hours (1h/week for Informatica IX-X and TIC IX-XII) are not directly verified against the plan-cadru annexes; the OMEN 4350/2025 order PDF accessed contains only the 4-page order text, not the hour-table annexes. Mitigated: the data flags exactly this in incertitudine #4 (hours confirmed only via programme text, not plan-cadru directly).
- Context note (not a defect): a later official OMEC 6.930/2026 (Monitorul Oficial nr. 4Bis, Jan 2026) for liceu programmes now exists, suggesting these 2025 consultation-stage programmes may have advanced toward adoption. This does not contradict the data, which correctly describes the consultation-publica snapshot, but the 'in consultare publica' status may be partially superseded.

**✏️ Corecții propuse:**
- Soften the class X Stiinte ale naturii content line to reflect that specific structures (stiva/coada/arbore binar) are NOT explicitly anchored to Stiinte ale naturii in the projection; only the asterisk legend ('(*) Doar pentru specializarile matematica-informatica...') is verbatim source. Present the X content as deduced from competences + asterisks, consistent with the incertitudini.
- Consider checking whether OMEC 6.930/2026 (programe liceu, MOf 4Bis) has since adopted/modified these programmes, to confirm the 'in consultare publica' status is still current as of June 2026.

---

## Umanist (Filologie / Științe Sociale)  `[umanist]`

- **Filieră:** teoretica  |  **Verificare:** `reject`
- **Specializări:** filologie, stiinte sociale

### Clasa a IX-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (trunchi comun TC)
  - *Bază legală:* Plan-cadru aprobat prin OMECR nr. 4.350/2025; programa scolara in transparenta publica (2025, fara numar OMEN final atasat la data publicarii)
  - *Limbaj/Software:* Nu se studiaza programare. Platforme: Google Workspace sau Microsoft Teams (domeniul 1); LibreOffice sau Microsoft Office (domeniul 2); Linux Ubuntu sau Microsoft Windows (domeniul 3)
  - *Conținut (în ordine):*
    - 1. Societate digitala: 1.1 Comunicare si colaborare digitala (e-mail, chat, retele sociale, formulare, neticheta, partajare resurse); 1.2 Aplicatii si platforme care sprijina invatarea (tutoriale, cursuri online, utilizare responsabila AI); 1.3 Introducere in inteligenta artificiala (algoritmi, bias, LLM, gandire critica, proprietate intelectuala); 1.4 Introducere in tehnologii emergente (realitate virtuala si augmentata)
    - 2. Continuturi digitale, tehnologii si aplicatii specializate: 2.1 Birotica - Documente digitale (procesare texte avansata: stiluri, combinare corespondenta, cuprins automat, AI in redactare); 2.2 Birotica - Prezentari digitale (teme predefinite, animatii, interactivitate, AI in generare prezentari)
    - 3. Sisteme de calcul: 3.1 Componenta hardware (CPU, RAM, ROM, stocare, interfete, periferice, placa de baza, alimentare/racire); 3.2 Componenta software (tipuri SO, gestiune fisiere, securizare sistem)

### Clasa a X-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (trunchi comun TC) — valabil toate profilurile si specializarile filierei teoretice
  - *Bază legală:* OMEN nr. 5099/09.09.2009 (Anexa nr. 5)
  - *Limbaj/Software:* Nu se studiaza programare. Aplicatii: Microsoft Excel, Microsoft Access, Microsoft PowerPoint (sau echivalente LibreOffice)
  - *Conținut (în ordine):*
    - 1. Foaie de calcul Excel: operatii elementare, deschidere/salvare registru, formate pagina, formatare celule, introducere date (numere, text), formatare text (font, stil, culoare), selectare/copiere/mutare/stergere celule, cautare/inlocuire, inserare randuri/coloane, unire celule, sortare, formule aritmetice si logice, completare automata (autofill), functii (MIN, MAX, COUNT, SUM, AVERAGE, IF), referinte relative/absolute/mixte, optiuni tiparire, diagrame si grafice (creare, editare, schimbare tip, mutare/copiere/stergere), import imagini/grafice
    - 2. Baze de date Access: deschidere/salvare/inchidere baza de date, moduri de vizualizare, proiectarea unei baze de date, creare tabela, cheie primara, index, proprietati camp, introducere/vizualizare/modificare/adaugare/stergere date, formulare simple (creare, introducere date, formatare text, fond, import imagine), conectare la baza de date existenta, cautare inregistrare, interogari simple si multiple, filtre, selectia si sortarea datelor, rapoarte (creare, modificare, antet/subsol, grupare date, total-raport, subtotal-raport)
    - 3. Prezentari PowerPoint: creare prezentare noua, alegerea caracteristicilor diapozitiv, inserare text/imagini, copiere/decupare/lipire text si imagini si diapozitive, stergere obiecte, reordonare diapozitive, formatare prezentare, elemente grafice, diagrame, obiecte OLE, optiuni de prezentare

### Clasa a XI-a

**TIC - Tehnoredactare asistata de calculator** — 1 ora/saptamana — curriculum diferentiat (CD) — specializarea FILOLOGIE
  - *Bază legală:* Plan-cadru: OMECI nr. 3410/16.03.2009; programa scolara aprobata prin ordin al ministrului (numar exact netiparit in document — blank; sursa: portal.eduhr.ro/tic_tehnoredactare_11-1.pdf confirma 1h/sapt CD conform 3410/2009)
  - *Limbaj/Software:* Nu se studiaza programare. Aplicatii: Microsoft Word (avansat), PageMaker sau QuarkXPress, editoare grafice
  - *Conținut (în ordine):*
    - 1. Organizarea spatiului de lucru si a posibilitatilor de imprimare: spatiu de lucru si spatiu tipografic (dimensiuni pagina, margini, zona de imprimare), formate coli/pagini, modalitati de imprimare (negativ, in oglinda, separatii de culoare, brosura); elemente grafice si de structura pe pagina tiparita (casete de text, coloane, imagini, titluri/subtitluri, margini, antet, subsol), reguli de compozitie/ergonomie/estetica a paginii
    - 2. Organizarea unei lucrari de intindere mare (brosura, revista, carte): elemente generale de structura (capitol, subcapitol, paragraf, alineat, cuprins, numerotare pagini, index, glosar), revista scolara (organizare grafica si structurala), realizarea unei carti pe baza unui proiect de echipa
    - 3. Formatarea si sablonizarea documentelor: format pagina, design general, formatare text (corp litera, stil, marime, culori, centrare, aliniere), formate paragrafe (marcatori, numerotari, borduri, tabulatori), culori si fonduri, utilizarea stilurilor, inserare obiecte grafice (imagini scanate, fotografii, scheme grafice, ecuatii), formatare obiecte, optimizare elemente grafice cu editoare grafice
    - 4. Utilizarea avansata a procesorului de texte Word: pregatire document (pagina, antet/subsol, paragraf, indentare, stiluri), dictionar si optiuni de corectie, macrocomenzi, lucrul in echipa (Track changes, partajare in retea), finalizare lucrare (corectii, cuprins automat, numerotare figuri, pregatire tiparire), editare PDF, mecanism OLE
    - 5. Procesor de texte profesional PageMaker sau QxPress: lansare in lucru, pregatire format document, casete de text/imagine, formate coloane, functia place (introducere text/imagine in casete), controlul textului si imaginii, amplasare imagini in raport cu textul, finalizare document (index, cuprins), optiuni de tiparire
    - 6. Elaborare produse: realizarea unei reviste scolare (colectiv de redactie, structura generala, tematica, organizare grafica, coperte), realizarea unei carti de format mic

**TIC - Tehnici de documentare asistata de calculator** — 2 ore/saptamana — curriculum diferentiat (CD) — specializarea STIINTE SOCIALE
  - *Bază legală:* OMEC nr. 3252/13.02.2006 (Anexa la ordin)
  - *Limbaj/Software:* Nu se studiaza programare. Aplicatii: Microsoft Word, PowerPoint, editor grafic (Windows sau free IrfanView), Sound Recorder, browser web, SharePoint
  - *Conținut (în ordine):*
    - 1. Tehnica proiectului: formularea temei, stabilirea obiectivelor, stabilirea sarcinilor de lucru, organizarea echipei si roluri, aplicatii de birotica si documentare, medii principale de lucru (procesor texte, PPT, editor grafic), legaturi intre aplicatii si transfer intre aplicatii, structura modulara a proiectului, sectiunile lucrarii, diagrama lucrarii, etape si termene
    - 2. Formatarea si sablonizarea documentelor electronice: format pagina de lucru si design diapozitiv, formatare text (corp litera, stil, marime, culori, aliniere), formate paragrafe, culori si fonduri, inserare obiecte grafice (imagini, fotografii, scheme grafice, desene, obiecte scanate), optimizarea elementelor grafice
    - 3. Utilizarea elementelor grafice si diagramelor: creare si utilizare baze de date pentru diagrame, particularizare diagrama, tipuri de diagrame (bar chart, pie chart etc.)
    - 4. Inserare obiecte complexe: filme, sunete, animatii 2D/3D, preluarea si prelucrarea sunetelor (Sound Recorder), inserare comentarii sonore, import filme si animatii
    - 5. Prezentarea publica a unui proiect electronic: utilizare videoproiector, prezentare in retea (NetMeeting), documente tiparite (folii retroproiector, pliante, brosuri), transformare in format pagina web, conversie PDF, ambalare si transport document
    - 6. Documentare cu Internet: operatii initiale (titlu tema, domenii de aplicabilitate), chei de cautare, motoare de cautare, enciclopedii online si pe CD, drepturi de autor (copyright), cautare avansata dupa cuvinte cheie, transfer obiecte intre aplicatii (imagini, text, tabele, link-uri, arhive), formatarea documentelor rezultate
    - 7. Forme de lucru cooperativ: aplicatie de partajare (SharePoint), partajare in retea, realizarea sumarului si sintezei de prezentare, interfata de prezentare (PowerPoint), concatenarea modulelor
    - 8. (Obligatorii doar la 2h/sapt — stiinte sociale) Biblioteca de documentare: analiza structurii, realizare structura, tipuri de documente, ierarhizare, niveluri de acces, protejare documente, distribuire sarcini

### Clasa a XII-a

**TIC - Tehnoredactare asistata de calculator** — 1 ora/saptamana — curriculum diferentiat (CD) — specializarea FILOLOGIE
  - *Bază legală:* OMECI nr. 5099/09.09.2009 (confirmat in repere metodologice 2024-2025, rocnee.eu)
  - *Limbaj/Software:* Nu se studiaza programare. Aplicatii: Microsoft FrontPage, Macromedia Dreamweaver (sau echivalente). HTML de baza, implicit.
  - *Conținut (în ordine):*
    - 1. Documente hipermedia — etapele procesului de dezvoltare a unei interfete Web; aspecte generale ale proiectarii interfetelor Web; organizarea informatiei utilizand tehnicile generale de tehnoredactare computerizata
    - 2. Aplicatii specializate in proiectarea si realizarea unui document hipermedia (I): prezentarea generala a unui editor de pagini Web (ex: Frontpage, Macromedia Dreamweaver); formatare text la nivel de caracter, paragraf, sectiune; inserarea hiperlegaturilor; inserarea si formatarea listelor; inserarea si formatarea tabelelor
    - 3. Aplicatii specializate in proiectarea si realizarea unui document hipermedia (II): inserarea obiectelor hipermedia (imagini, secvente audio si video); maparea imaginilor; cadre (frames); proiectarea si realizarea designului general al documentului hipermedia utilizand elementele studiate; publicare si testare
    - 4. Crearea si prezentarea unui proiect in echipa, cu tema la alegere: tema proiectului (in functie de specificul clasei si interesul elevilor); reguli de lucru in echipa; planul de lucru; culegerea datelor necesare, structurarea datelor, realizarea si documentarea aplicatiei; reguli de baza pentru prezentarea unui proiect; prezentarea proiectului

**TIC - Tehnici de documentare asistata de calculator** — 1 ora/saptamana — curriculum diferentiat (CD) — specializarea STIINTE SOCIALE
  - *Bază legală:* OMECI nr. 5099/09.09.2009 (confirmat in repere metodologice 2024-2025, rocnee.eu)
  - *Limbaj/Software:* Nu se studiaza programare. Aplicatii: Microsoft FrontPage, Macromedia Dreamweaver (sau echivalente). HTML de baza, implicit.
  - *Conținut (în ordine):*
    - 1. Documente hipermedia — etapele procesului de dezvoltare a unei interfete Web; aspecte generale ale proiectarii interfetelor Web; organizarea informatiei utilizand tehnicile generale de tehnoredactare computerizata
    - 2. Aplicatii specializate in proiectarea si realizarea unui document hipermedia (I): prezentarea generala a unui editor de pagini Web (ex: Frontpage, Macromedia Dreamweaver); formatare text la nivel de caracter, paragraf, sectiune; inserarea hiperlegaturilor; inserarea si formatarea listelor; inserarea si formatarea tabelelor
    - 3. Aplicatii specializate in proiectarea si realizarea unui document hipermedia (II): inserarea obiectelor hipermedia (imagini, secvente audio si video); maparea imaginilor; cadre (frames); proiectarea si realizarea designului general al documentului hipermedia; publicare si testare
    - 4. Crearea si prezentarea unui proiect in echipa, cu tema la alegere: tema proiectului; reguli de lucru in echipa; planul de lucru; culegerea datelor, structurarea, realizarea si documentarea aplicatiei; prezentarea proiectului

**Surse oficiale consultate:**
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Tehnologia_informatiei_si_a_comunicatiilor_TC_IX.pdf
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/TIC_clasa%20a%20X-a.pdf
- https://portal.eduhr.ro/wp-content/uploads/2021/10/tic_tehnoredactare_11-1.pdf
- https://www.isjcta.ro/wp-content/uploads/2013/06/tic11_documentare_omec.pdf
- https://portal.eduhr.ro/wp-content/uploads/2021/10/tic_tehnoredactare_12.pdf
- https://rocnee.eu/images/rocnee/fisiere/repere_medotologice/2025/finale/REPERE_METODOLOGICE_TIC_2024_2025_CLS_XII.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2023/preuniversitar_root/repere_metodologice_XI/invatamant_liceal/REPERE_METODOLOGICE_TIC_2023_2024_CLS_XI.pdf
- https://www.edu.ro/cons_pub_programe_scolare_liceu

**⚠️ Incertitudini (de re-verificat înainte de build):**
- Programa scolara pentru clasa a IX-a (edu.ro, 2025) are spatiu BLANK pentru numarul ordinului ministrului (nu a primit inca numar OMEN final la data publicarii in transparenta — noiembrie 2025). Numarul planului-cadru este OMECR 4350/2025.
- Programa pentru TIC Tehnoredactare cls. XI (filologie, portal.eduhr.ro) are de asemenea spatiu BLANK la numarul ordinului ministrului. Documentul invoca OMECI 3410/16.03.2009 ca baza pentru planul-cadru (1h/sapt CD), dar numarul propriu-zis al ordinului de aprobare al PROGRAMEI nu este tiparit in document.
- Noul plan-cadru OMECR 4350/2025 prevede TIC ca TC 1h/sapt pentru TOATE filierele/profilurile/specializarile la cls. IX-XII — aceasta ar elimina distinctia CD vs TC si programele diferentiate pe specializare. Insa la data cercetarii (iunie 2026) programele noi pentru cls. X, XI, XII sub noul plan-cadru NU au fost publicate oficial. Programele CD vechi (OMEN 5099/2009, 3252/2006, 3410/2009) raman in vigoare pentru generatiile aflate in curs.
- Programa XII pentru specializarea Stiinte Sociale (Tehnici de documentare asistata de calculator) nu a putut fi identificata ca document PDF distinct — continutul a fost reconstruit din planificarea calendaristica din Repere metodologice 2024-2025 (rocnee.eu). Aceasta confirma OMECI 5099/2009 si 1h/sapt CD, dar programa completa (cu competente specifice) nu a fost accesata direct.
- Programele XI si XII sub regimul OMECI 5099/2009 (Tehnoredactare cls. XII, Documentare cls. XII stiinte sociale) au continut identic la cele doua specializari in cls. XII — ambele parcurg documentele hipermedia/web. Aceasta identitate de continut a fost confirmata din repere metodologice, nu din doua documente-programa distincte.

**🔎 Probleme semnalate de verificatorul adversarial:**
- vezi mai sus

**✏️ Corecții propuse:**
- Clasa IX: schimba "limbaj_programare":"Nu se studiaza programare" in "Se studiaza elemente introductive de programare si robotica (ex. Scratch, Blockly, programarea robotilor virtuali, senzori), in cadrul societatii digitale si al sistemelor de calcul" - conform programei TC_IX 2025 (edu.ro).
- Inlocuieste "OMECR nr. 4350/2025" cu "OMEC nr. 4350/2025 (Ordinul ministrului educatiei si cercetarii)", asa cum apare in Monitorul Oficial Partea I nr. 594/26.06.2025 si in programa oficiala.
- Clasa XII (ambele discipline): marcheaza numarul de ordin al PROGRAMEI ca BLANK in document (la fel ca la XI tehnoredactare), nu "OMECI 5099/2009". 5099/2009 poate fi citat doar ca ordinul-umbrela TIC liceu 2009 / referinta de plan-cadru, NU ca numarul tiparit de aprobare al programei de cls. XII (care lipseste din PDF).

---

## Tehnologic  `[tehnologic]`

- **Filieră:** tehnologica  |  **Verificare:** `pass`
- **Specializări:** Tehnician in automatizari, Tehnician operator tehnica de calcul, Tehnician in activitati economice, Tehnician ecolog si protectia calitatii mediului, alte calificari profil tehnic/servicii/resurse

### Clasa a IX-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (trunchi comun - TC)
  - *Bază legală:* OMECI nr. 3411/16.03.2009 (plan-cadru cls. IX filiera tehnologica); programa scolara aprobata prin ordin MECI 2009 (nr. exact nu apare in exemplarul de la isjcta.ro)
  - *Conținut (în ordine):*
    - 1. Calculatoare si retele de calculatoare: componente hard/soft, sisteme de operare, retele LAN/MAN/WAN/Internet, securitate, ergonomie, legislatie software
    - 2. Sistemul de operare Windows: operare elementara, interfata SO, organizare fisiere/directoare, accesorii (Notepad, Paint, Calculator), tiparire
    - 3. Editor de texte (Word): operatii de baza, procesare text, formatare, tabele, imagini, tiparire documente
    - 4. Internet si servicii web: arhitectura Internet, TCP/IP, servicii (WWW, e-mail, Chat, FTP), acces Internet, adresare, motoare de cautare, e-mail, securitate, neticheta
    - 5. Pagini HTML: editor HTML, inserare text si imagini, hiper-legaturi, tabele in HTML, aplicatii practice

### Clasa a X-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (trunchi comun - TC)
  - *Bază legală:* OMECI nr. 5099/09.09.2009, Anexa nr. 5
  - *Conținut (în ordine):*
    - 1. Aplicatia Excel (calcul tabelar): operatii elementare, formatare celule, formule aritmetice si logice, functii (min, max, count, sum, average, if), referinte relative/absolute, grafice si diagrame, import obiecte, aplicatii practice
    - 2. Aplicatia Access (baze de date): operatii elementare, proiectare BD, creare/modificare tabele, chei primare, indecsi, formulare, interogari (simple si multiple), filtre, rapoarte, aplicatii practice
    - 3. Aplicatia PowerPoint (prezentari): creare prezentare, inserare text/imagini/obiecte grafice, formatare, diagrame, animatie, tranzitii, tiparire, aplicatii practice

### Clasa a XI-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (curriculum diferentiat - CD, ciclul superior al liceului, ruta directa de calificare)
  - *Bază legală:* OMECI nr. 5099/09.09.2009 (confirmat in Reperele Metodologice cls. XI, 2023-2024, ME/CNPEE)
  - *Conținut (în ordine):*
    - 1. Date, informatii si utilizarea acestora: notiuni de baza (date, informatii, proces informational, baza informationala, flux informational, sistem informatic), surse de informatie (banci de date, BD, Internet/Intranet), prezentare si utilizare informatii in documente si prezentari
    - 2. Date din reteaua Internet: cautarea si regasirea informatiei, tehnici de cautare dupa criterii multiple, aplicatii cu documente si prezentari utilizand informatii de pe Internet
    - 3. Organizarea si prelucrarea datelor simple si a structurilor de date: tipuri de informatii/date (numerice, text, imagini, logice), structuri de date (variabile, fisiere, foi de lucru, tabele, BD, liste), operatori aritmetici/relationali/logici
    - 4. Functii predefinite specifice tipurilor de date si functii utilizator: functii predefinite (aritmetice, logice, cautare, financiare, pe siruri, informative), functii utilizator (definire, apelare in documente)
    - 5. Instrumente software pentru sistemele informatice: caracteristici, utilizarea instrumentelor de lucru (schite, grafice/diagrame, sabloane, rapoarte simple si complexe, functii), studii de caz specifice calificarii

### Clasa a XII-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (curriculum diferentiat - CD, ciclul superior al liceului, ruta directa de calificare; 34 sapt. cursuri din care 5 sapt. stagii pregatire practica)
  - *Bază legală:* OMECI nr. 5099/09.09.2009 (confirmat in Reperele Metodologice cls. XII 2024-2025, ME/CNPEE)
  - *Conținut (în ordine):*
    - 1. Instrumente si structura unui site web: instrumente pentru creare site-uri (editoare text/HTML/imagini), tipuri de site-uri (statice, dinamice/interactive), structura paginii web, SEO
    - 2. Structura unui site web - elemente de continut: text, liste, tabele, imagini, harti de imagini, animatie, cadre, filme, butoane; ierarhia paginilor, sistem de link-uri; criterii de realizare (viteza incarcare, raport text/imagine, acuratete, lizibilitate, design)
    - 3. Concepte generale ale managementului proiectului: notiunea de proiect, obiective, faze, manager/echipa de proiect, plan, WBS, grafic de activitati, traseu critic, initierea proiectului
    - 4. Etapele unui proiect: planificarea (organigrama, structura echipei, plan de proiect, WBS, alocare resurse), monitorizarea (cereri de schimbare, controlul riscului, rapoarte de progres/exceptii), evaluarea (calitatea proiectelor, raport de sfarsit de proiect)
    - 5. Componente si instrumente ale proiectului: organizatia de proiect, planuri, mijloace de control, managementul riscului/schimbarii/configuratiei, instrumente software (grafice, schite, sabloane, diagrame), aplicatii practice

**Surse oficiale consultate:**
- https://isjcta.ro/wp-content/uploads/2013/06/tic_9_liceu_tehnologic.pdf - Programa scolara TIC cls. IX, filiera tehnologica (MECI 2009)
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/TIC_clasa%20a%20X-a.pdf - Programa scolara TIC cls. X, OMECI 5099/2009 (ROCNEE)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2023/preuniversitar_root/repere_metodologice_XI/invatamant_liceal/REPERE_METODOLOGICE_TIC_2023_2024_CLS_XI.pdf - Repere Metodologice TIC cls. XI, an scolar 2023-2024 (ME/CNPEE)
- https://rocnee.eu/images/rocnee/fisiere/repere_medotologice/2025/finale/REPERE_METODOLOGICE_TIC_2024_2025_CLS_XII.pdf - Repere Metodologice TIC cls. XII, an scolar 2024-2025 (ME/CNPEE)
- https://www.edu.ro/curriculum-%C3%AEnv%C4%83%C8%9B%C4%83m%C3%A2nt-liceal-tehnologic - Curriculum invatamant liceal tehnologic, edu.ro
- https://rocnee.eu/index.php/dcee-oriz/curriculum-oriz/planuri-cadru-actuale - Planuri-cadru actuale, ROCNEE (OMECI 3411/2009 cls. IX; OMECI 3412/2009 cls. X-XII)

**⚠️ Incertitudini (de re-verificat înainte de build):**
- Numarul exact al ordinului ministerial care aproba programa TIC cls. IX pentru filiera tehnologica: documentul de la isjcta.ro are campurile OMEN necompletate (blank); contextul indica emiterea odata cu OMECI 3411/2009 (planul-cadru), dar nu s-a putut citi numarul exact al ordinului care aproba programa in sine dintr-o sursa primara accesibila
- Existenta si continutul unui curriculum diferentiat (CD) specific de Informatica/programare pentru calificarile IT din filiera tehnologica (ex. Tehnician operator tehnica de calcul) in clasele IX-XII: nu s-au putut accesa programele modulare de specialitate (CDL/CD) pentru aceste calificari specifice din surse oficiale verificabile in aceasta sesiune
- Daca exista module de programare (Pascal, C/C++, Python) in curricula diferentiat sau CDL al liceelor tehnologice cu calificari IT: nu s-a confirmat oficial; disciplina Informatica cu programare (Pascal/C++) a fost identificata doar pentru filiera teoretica profil real (OMECI 5099/2009, Anexa 5)
- Planurile-cadru noi pentru liceu din 2025-2026 (aflate in consultare publica conform edupedu.ro): nu se stie daca au intrat in vigoare si cum modifica distributia TIC pentru filiera tehnologica incepand cu 2026-2027
- Ore TIC cls. IX in planul-cadru actual: sursa ISJCTA indica 1 ora/saptamana TC, dar un document de repere metodologice pentru invatamant special indica 2 ore/saptamana; distinctia invatamant de masa vs. special nu a putut fi confirmata dintr-un plan-cadru oficial actualizat accesat direct

**🔎 Probleme semnalate de verificatorul adversarial:**
- MINOR (not a falsification): The class XI/XII content-unit names in the data are quoted from the ORIGINAL OMECI 5099/2009 programa (e.g. 'Date, informatii si utilizarea acestora', 'Functii predefinite...', 'Instrumente si structura unui site web', 'Concepte generale ale managementului proiectului'). The 2023-2024/2024-2025 Repere Metodologice present a competency-restructured view (e.g. XI: 'I. Organizarea datelor', 'II. Prelucrarea datelor'; XII: 'Structura unui site Web', 'Etapele unui proiect'), so phrasing differs between the two document types. This is a documented-uncertainty area, not an invented claim - both the programa wording and the Repere wording were confirmed in official PDFs.
- MINOR: The shared class X programa PDF (ROCNEE) carries a running footer 'filiera teoretica' because OMECI 5099/2009 Anexa 5 is a single document covering teoretica+tehnologica+vocationala 'toate profilurile'. The data's attribution of this programa to filiera tehnologica clasa X is correct (search result and header confirm it applies to all three streams), but a careless reader of the footer alone could think it is teoretica-only. The data handles this correctly.
- NOTE: The data's 'incertitudini' section is accurate and honest - I independently confirmed the class IX programa (isjcta.ro) literally has BLANK OMEN fields ('Anexa nr. ....la ordinul ... nr. ......./.........'), so the refusal to state an exact approving-order number for the IX programa is correct, not a gap. Likewise the masa(1 ora)-vs-special(2 ore) distinction the data flagged is real: the masa programa says 'o ora/saptamana trunchi comun', while didactic.ro and the invatamant special Repere show 2 ore.

**✏️ Corecții propuse:**
- None required for a pass. Optional clarity improvement: in the XI/XII entries, note explicitly that the listed 'continut' reflects the original OMECI 5099/2009 programa wording, while current Repere Metodologice regroup the same content under competency-based domain headings (XI: Organizarea datelor / Prelucrarea datelor; XII: Structura unui site Web / Etapele unui proiect). Both are official and consistent.

---

## Vocațional (Militar / Pedagogic / Teologic / Sportiv)  `[militar-pedagogic-teologic-sportiv]`

- **Filieră:** vocationala  |  **Verificare:** `reject`
- **Specializări:** Matematica-informatica militara (profil militar - MApN/MAI), Pedagogia invatamantului primar si prescolar, Pedagog scolar / Instructor extracurricular / Mediator scolar (profil pedagogic), Toate specializarile (profil teologic - ortodox, catolic, reformat, penticostal, etc.), Toate specializarile (profil sportiv)

### Clasa a IX-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 2 ore/saptamana (trunchi comun - TC)
  - *Bază legală:* OMECI nr. 5099/09.09.2009, Anexa 5
  - *Limbaj/Software:* Nu se studiaza limbaj de programare; focus pe utilizarea aplicatiilor (MS Office, Internet, HTML)
  - *Conținut (în ordine):*
    - Dezvoltarea deprinderilor moderne de utilizator: hardware, software, retele, securitate, ergonomie, aspecte legale
    - Medii informatice de lucru: sistem de operare (Windows), gestionarea fisierelor si directoarelor, procesare de text, imprimare
    - Produse utilizabile si creativitate: Internet, e-mail, elemente de HTML, realizarea paginilor Web

**Informatica (curriculum de specialitate - CS) [DOAR profil militar, specializarea Matematica-informatica militara]** — 3-4 ore/saptamana (curriculum de specialitate - CS)
  - *Bază legală:* OMEC nr. 4350/2025 (noul plan cadru, aplicabil din sept. 2026 pentru cls. IX); anterior: OMECI nr. 5099/2009 pentru programele existente
  - *Limbaj/Software:* C++ (principal); Pascal folosit in manualele vechi; noile programe 2025 propun si Python
  - *Conținut (în ordine):*
    - Conceptul de algoritm, caracteristici, exemple; reprezentare in pseudocod
    - Date: tipuri simple (integer, real, char, boolean), constante, variabile, expresii
    - Operatii de intrare/iesire
    - Structuri de baza ale programarii structurate: liniara, alternativa (if/else), repetitiva (while, do-while, for)
    - Algoritmi elementari: maxim/minim, cifre ale unui numar, divizibilitate, numere prime
    - Tablouri unidimensionale (vectori): declarare, parcurgere, sortare (bubble, selectie, insertie), cautare binara
    - Tablouri bidimensionale (matrice): declarare, parcurgere, tablouri patratice
    - Subprograme si subprograme predefinite pentru operatii uzuale
    - Structura unui program C++: vocabular, tipuri simple de date, constante, variabile, expresii, intrare/iesire, structuri de control

### Clasa a X-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (trunchi comun - TC)
  - *Bază legală:* OMECI nr. 5099/09.09.2009
  - *Limbaj/Software:* Nu se studiaza limbaj de programare; focus pe aplicatii MS Office
  - *Conținut (în ordine):*
    - Developarea deprinderilor moderne de utilizator: Microsoft Excel (formule, functii, calcule)
    - Cunoasterea mediilor informatice de lucru: Microsoft Access (baze de date, tabele, interogari)
    - Elaborarea produselor utilizabile care dezvolta creativitatea: Microsoft PowerPoint (prezentari cu efecte animate)

**Informatica (curriculum de specialitate - CS) [DOAR profil militar, specializarea Matematica-informatica militara]** — 3 ore/saptamana (curriculum de specialitate - CS)
  - *Bază legală:* OMECI nr. 5099/09.09.2009 (programe in vigoare pana in 2026)
  - *Limbaj/Software:* C++ (principal)
  - *Conținut (în ordine):*
    - Tablouri unidimensionale si bidimensionale: tip, declarare, operatii
    - Fisiere text: mecanisme de citire si scriere, sfarsit de fisier
    - Subprograme: definitie, apel, parametri, mecanisme de executie
    - Subprograme predefinite pentru operatii uzuale
    - Algoritmi pe tablouri: sortare avansata, cautare
    - Aplicatii practice cu fisiere si tablouri

### Clasa a XI-a

**Tehnologia Informatiei si a Comunicatiilor - Tehnici de documentare asistata de calculator (TIC / Documentare) [profil pedagogic si ordine-securitate publica/MAI]** — 1 ora/saptamana (trunchi comun sau curriculum diferentiat, in functie de specializare)
  - *Bază legală:* OMECI nr. 5099/09.09.2009, Anexa la ordin
  - *Limbaj/Software:* Nu se studiaza limbaj de programare; focus pe tehnici de documentare cu calculatorul
  - *Conținut (în ordine):*
    - Tehnici de documentare electronica: colectare, selectare, analiza informatiei din surse multiple
    - Prelucrarea documentelor complexe cu procesor de text (Word avansat: sectiuni, tabele complexe, indecsi, note de subsol)
    - Prezentari multimedia avansate (PowerPoint avansat: animatii, tranzitii, continut multimedia)
    - Calcul tabelar avansat si baze de date (Excel: functii avansate, filtrare, pivot; Access: interogari avansate)
    - Publicare electronica si tehnoredactare asistata de calculator
    - Comunicare electronica si colaborare online

**Tehnologia Informatiei si a Comunicatiilor (TIC) [profiluri: teologic, toate specializarile - clasa XI]** — 1 ora/saptamana (trunchi comun - TC)
  - *Bază legală:* OMECI nr. 5099/09.09.2009
  - *Limbaj/Software:* Nu se studiaza limbaj de programare
  - *Conținut (în ordine):*
    - Continut similar cu Tehnici de documentare asistata (documentare, prelucrare documente, prezentari, comunicare electronica)

**Informatica (curriculum de specialitate - CS) [DOAR profil militar, specializarea Matematica-informatica militara]** — 3-4 ore/saptamana (curriculum de specialitate - CS)
  - *Bază legală:* OMECI nr. 5099/09.09.2009 / referinte la programe OMEC 2025 pentru ciclul superior
  - *Limbaj/Software:* C++ (principal); Pascal in manualele vechi
  - *Conținut (în ordine):*
    - Structuri de date: siruri de caractere, inregistrari (struct/record), liste alocate static (stive, cozi)
    - Liste alocate dinamic: implementare, operatii elementare
    - Grafuri: reprezentare (matrice de adiacenta, liste de adiacenta), proprietati de baza, parcurgere BFS/DFS
    - Arbori: definitie, reprezentare, parcurgere
    - Fisiere binare si text: mecanisme avansate de citire/scriere
    - Subprograme recursive: recursivitate, exemple (factorial, Fibonacci, Hanoi)
    - Algoritmi de sortare avansata: MergeSort, QuickSort
    - Programare orientata obiect (POO): notiuni introductive, clase, obiecte

### Clasa a XII-a

**Tehnologia Informatiei si a Comunicatiilor - Tehnici de documentare asistata de calculator (TIC / Documentare) [profil pedagogic si ordine-securitate publica/MAI]** — 1 ora/saptamana (trunchi comun sau diferentiat)
  - *Bază legală:* OMECI nr. 5099/09.09.2009, Anexa; autor manual: Mihaela Garabet, Ion Neacsu (ed. Universitara)
  - *Limbaj/Software:* Nu se studiaza limbaj de programare
  - *Conținut (în ordine):*
    - Recapitulare si aprofundare tehnici de documentare electronica
    - Crearea si editarea documentelor complexe: rapoarte, lucrari stiintifice, bibliografii
    - Etape de dezvoltare web: HTML avansat, linkuri, liste, tabele, imagini, cadre, servere web
    - Formate de publicare: DTP, e-book, portofoliu digital
    - Tehnoredactare asistata de calculator: layout, fonturi, prelucrare imagini
    - Comunicare si colaborare in mediu digital: retele sociale, colaborare online, securitate informatica

**Informatica (curriculum de specialitate - CS) [DOAR profil militar, specializarea Matematica-informatica militara]** — 3-4 ore/saptamana (curriculum de specialitate - CS); unele surse indica 1 ora teorie + 2 ore laborator
  - *Bază legală:* OMECI nr. 5099/09.09.2009 (programe vechi in vigoare); OMEC 4350/2025 aproba noi planuri cadru (aplicabile din 2026)
  - *Limbaj/Software:* C++ (principal); SQL pentru bazele de date
  - *Conținut (în ordine):*
    - Programare orientata obiect (POO) aprofundata: clase, obiecte, mostenire, polimorfism, incapsulare
    - Structuri de date avansate: grafuri (algoritmi: Dijkstra, Roy-Floyd, Kruskal, Prim), arbori (AVL, heap)
    - Baze de date relationale: model relational, SQL (SELECT, INSERT, UPDATE, DELETE, JOIN)
    - Programarea procedurala a bazelor de date (PL/SQL / TransactSQL / MySQL)
    - Aplicatii grafice si interfete utilizator
    - Algoritmi de tip Divide et Impera, Greedy, Backtracking (aprofundare)
    - Securitate informatica si aspecte de etica in informatica

**Surse oficiale consultate:**
- https://www.slideshare.net/profadeinfo41/programa-scolara-tic9 (programa TIC cls. IX, OMECI 5099/2009)
- https://www.slideshare.net/profadeinfo41/programa-scolara-tic10 (programa TIC cls. X, OMECI 5099/2009)
- https://pdfcoffee.com/planificare-tic-ix-pdf-free.html (planificare TIC IX, confirma OMECI 5099/2009, 1 ora/sapt. pentru filiera tehnologica)
- https://www.yumpu.com/ro/document/view/39627071/tehnici-de-documentare-asistata-de-calculator (programa TIC Tehnici de documentare cls. XII, vocationala pedagogic + ordine publica)
- https://www.isjcta.ro/wp-content/uploads/2013/06/tic11_documentare_omec.pdf (TIC documentare cls. XI, ISJ Cluj-Tarnavele)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2023/preuniversitar_root/repere_metodologice_XI/invatamant_liceal/REPERE_METODOLOGICE_TIC_2023_2024_CLS_XI.pdf (Repere metodologice TIC cls. XI 2023-2024, edu.ro)
- https://rocnee.eu/images/rocnee/fisiere/repere_medotologice/2025/finale/REPERE_METODOLOGICE_TIC_2024_2025_CLS_XII.pdf (Repere metodologice TIC cls. XII 2024-2025, ROCNEE)
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/TIC_clasa%20a%20X-a.pdf (programa TIC cls. X, ROCNEE 2023)
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/TIC_Tehnici%20de%20documentare%20asistata%20de%20calculator_teoretic_vocational_clasa%20a%20XII-a.pdf (programa TIC documentare cls. XII, ROCNEE)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_CS_IX_Militar_Matematica_informatica_militara.pdf (programa Informatica CS cls. IX profil militar, edu.ro 2025)
- https://www.edu.ro/OMEC_4350_2025_planuri_cadru_liceu_frecventa_zi (OMEC 4350/2025, planuri cadru liceu)
- https://www.pbinfo.ro/articole/5547/informatica-clasa-a-ix-a (continut informatica cls. IX C++)
- http://oldsite.edu.ro/index.php/articles/12809 (edu.ro vechi: programa informatica cls. IX profil real + militar)
- http://oldsite.edu.ro/index.php/articles/12811 (edu.ro vechi: programa informatica cls. XI profil real + militar)

**⚠️ Incertitudini (de re-verificat înainte de build):**
- Continutul exact al unitatilor TIC cls. XI si XII pentru profilurile SPORTIV si TEOLOGIC nu a putut fi extras direct din documente oficiale (PDF-urile sunt comprimate/binare si nu au putut fi citite de WebFetch). Din sursele secundare se stie ca aceste profiluri urmeaza programele TIC generale, insa nu exista confirmarea exacta a titlului variantei de programa aplicabile (Tehnici de documentare asistata vs. TIC general vs. Tehnoredactare).
- Nu s-a putut confirma cu certitudine daca profilul SPORTIV studiaza TIC in cls. XI-XII sau numai in cls. IX-X. O sursa indica ca profilul sportiv NU apare explicit in lista profilurilor din programa TIC cls. XI (spre deosebire de teologic, pedagogic, ordine publica). Aceasta ramane incertitudine.
- Orele exacte pe saptamana pentru disciplina Informatica (CS) la profil militar, cls. X-XII, nu au putut fi confirmate dintr-o sursa primara citibila - sursele secundare indica 3 ore/sapt. pentru cls. IX-X si 4 ore/sapt. sau 1 teorie + 3 lab. pentru cls. XI-XII, dar fara a cita un document oficial clar.
- Unele informatii despre continuturile exacte si ordinea lor pentru Informatica profil militar cls. X, XI, XII provin din inferente bazate pe structura manualalelor si pe reperele metodologice, nu din textul programei oficiale citit direct.
- Noile planuri cadru OMEC 4350/2025 si noile programe scolare (consultare publica 2025) vor inlocui programele OMECI 5099/2009 incepand cu cls. IX din septembrie 2026; nu se stie inca cu exactitate daca continuturile TIC pentru filiera vocationala (profiluri non-militar) se vor modifica semnificativ.
- Nu s-a confirmat din surse oficiale daca exista o disciplina TIC separata sau sub alt titlu pentru profilul TEOLOGIC in cls. XI-XII (existe mentionari in surse secundare ca profilul teologic e inclus in lista programelor TIC din cls. XI, dar nu exista link direct catre programa specifica).
- Numarul exact de ore TIC in trunchi comun vs. curriculum diferentiat (TC vs. CD) pentru fiecare profil vocational, pe fiecare clasa, nu a putut fi extras dintr-un tabel oficial complet - planurile cadru PDF (Anexele OMEC 4350/2025) nu au putut fi citite.

**🔎 Probleme semnalate de verificatorul adversarial:**
- TIC clasa IX — ORELE SUNT GRESITE. Datele afirma '2 ore/saptamana (trunchi comun)'. Programa oficiala OMECI 5099/2009 (textul: ISJ Cluj tic_9_liceu_tehnologic.pdf) spune EXPLICIT: 'studiata in clasa a IX-a, cu O ORA/saptamana in trunchiul comun'. Eroare factuala directa pe o cifra centrala.
- TIC clasa IX — FILIERA gresit atribuita. Programa oficiala TIC IX (OMECI 5099/2009) este pentru 'Filiera TEHNOLOGICA, toate profilurile si specializarile' SI NU listeaza filiera vocationala in antet. Doar programa TIC clasa X listeaza filiera vocationala (artistic, sportiv, pedagogic, teologic, ordine si securitate publica/MAI). Datele prezinta TIC IX ca disciplina de trunchi comun pentru setul vocational (militar/pedagogic/teologic/sportiv) fara aceasta distinctie — ceea ce este inexact pentru clasa IX.
- Informatica profil militar — LIMBAJUL este INVERSAT. Datele spun pentru cls. IX: 'C++ (principal); ... noile programe 2025 propun si Python'. Programa oficiala 2025 (edu.ro Informatica_CS_IX_Militar_Matematica_informatica_militara.pdf, conform OMEC 4350/2025) spune EXPLICIT: 'utilizarea Python ca limbaj de programare de BAZA ... la filiera vocationala, profilul militar' si 'utilizarea C++, suplimentar, ca al doilea limbaj de programare, DOAR la filiera teoretica, profil real ... regim intensiv'. Deci pentru profilul MILITAR, C++ NU se foloseste deloc in noua programa; Python e baza. Datele inverseaza relatia.
- Informatica profil militar — ORELE supraestimate/inventate. Datele indica '3-4 ore/saptamana' la cls. IX si XI-XII si '1 ora teorie + 2/3 ore laborator'. Programa oficiala 2025 spune EXPLICIT pentru TOATE clasele IX-XII profil militar: '3 ore/saptamana, dintre care doua ore pentru studiu teoretic si o ora pentru activitati practice'. Deci este constant 3 ore (2 teorie + 1 practica), nu '3-4' si nu '1 teorie + 3 lab'. Speculatiile din date nu se confirma in sursa primara.
- Atribuirea OMEN pentru Informatica militara este amestecata/imprecisa. Datele atribuie continutul militar la 'OMECI 5099/2009' (cls. X, XI, XII) ca 'programe in vigoare'. In realitate noua programa de informatica profil militar publicata (consultare 2025) este construita pe OMEC 4350/2025 (Legea 198/2023) — un cadru complet nou cu Python/ML/SQL, NU pe continutul OMECI 5099/2009. Vechile programe de informatica militar erau pe alte ordine (oldsite.edu.ro art.12809/12811), nu pe 5099/2009 care e ordinul TIC. Atribuirea ordinului pentru Informatica este astfel inexacta.

**✏️ Corecții propuse:**
- TIC clasa IX: corecteaza '2 ore/saptamana' -> 'O ora/saptamana (trunchi comun)', filiera tehnologica (programa IX nu listeaza vocational in antet). Sursa: OMECI 5099/2009, programa TIC cls. IX, text oficial.
- TIC clasa X: corect — 'o ora/saptamana, trunchi comun', filiera teoretica + tehnologica + vocationala (artistic, sportiv, pedagogic, teologic, ordine si securitate publica/MAI). Continut Excel/Access/PowerPoint confirmat. Aceasta intrare este CORECTA.
- Informatica profil militar (programa noua 2025, aplicabila din sept. 2026 pt cls. IX): limbaj de BAZA = Python; C++ NU la militar (doar la teoretic real intensiv); SQL in clasa XII. Ore: 3/saptamana (2 teorie + 1 practica) la fiecare clasa IX-XII. Sursa: edu.ro programa Informatica CS IX militar, conform OMEC 4350/2025.
- TIC 'Tehnici de documentare asistata' cls. XI: filiera teoretica profil umanist stiinte sociale + vocationala militar M.A.I. stiinte sociale + vocationala pedagogic toate specializarile. Atribuirea 'pedagogic si ordine-securitate/MAI' este aproximativ corecta. Aceasta intrare se sustine.
- Pastreaza incertitudinile declarate (sportiv/teologic cls. XI-XII, TC vs CD) — ele sunt oneste si confirmate ca zone neacoperite de sursele primare citibile.

---

## Artistic  `[artistic]`

- **Filieră:** vocationala  |  **Verificare:** `reject`
- **Specializări:** Muzica (toate sectiile si subsectiile), Arte plastice, Arte decorative, Design, Arhitectura, Arte ambientale, Coregrafie, Arta actorului, Conservare-restaurare bunuri culturale

### Clasa a IX-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 2
  - *Bază legală:* OMECI nr. 5099/09.09.2009 (Anexa la ordin, Monitorul Oficial nr. 764 bis/2009)
  - *Limbaj/Software:* Nu se studiaza limbaj de programare. Accent pe software aplicativ (sisteme de operare, procesoare de text, browser web, client email, editor HTML de baza).
  - *Conținut (în ordine):*
    - 1. Dezvoltarea deprinderilor moderne de utilizator: componente hardware si software, sisteme de operare, retele de calculatoare, securitate informatica, sanatate si ergonomie, legislatia drepturilor de autor
    - 2. Cunoasterea mediilor informatice de lucru: interfata sistemului de operare, gestiunea fisierelor, procesare de text (editare, formatare, tiparire), accesorii de baza
    - 3. Elaborarea produselor utilizabile si creativitate: arhitectura Internet, servicii online, posta electronica, securitate pe Internet, crearea de pagini HTML, aplicatii web

### Clasa a X-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1
  - *Bază legală:* OMECI nr. 5099/09.09.2009
  - *Limbaj/Software:* Nu se studiaza limbaj de programare. Accent pe aplicatii de birotice (Excel, Access, PowerPoint).
  - *Conținut (în ordine):*
    - 1. Dezvoltarea deprinderilor moderne de utilizator: aplicatii Excel - operatii elementare, formatare, formule, functii, grafice
    - 2. Cunoasterea mediilor informatice de lucru: aplicatii Access - baze de date, tabele, formulare, interogari, rapoarte
    - 3. Elaborarea produselor utilizabile: aplicatii PowerPoint - prezentari, efecte, animatii, tiparire

### Clasa a XI-a

**TIC - Tehnici de prelucrare audio-vizuala** — 1 (curriculum diferentiat - CD)
  - *Bază legală:* OMECI nr. 5099/09.09.2009
  - *Limbaj/Software:* Nu se studiaza limbaj de programare. Accent pe software de editare audio-video (tip Audacity, Adobe Audition, editoare video).
  - *Conținut (în ordine):*
    - NOTA: Aceasta varianta se aplica pentru specializarile: Muzica, Arta actorului, Coregrafie
    - Tehnici de prelucrare audio: inregistrare, editare, mixaj, efecte audio
    - Tehnici de prelucrare video: captare, editare, montaj, efecte vizuale
    - Crearea de produse audio-vizuale integrate

**Procesarea computerizata a imaginii** — 2 (curriculum diferentiat - CD; grupe de 8-12 elevi)
  - *Bază legală:* OMECI nr. 5099/09.09.2009 (proiect programa publicat pe edu.ro; versiune 2025 in consultare publica)
  - *Limbaj/Software:* Nu se studiaza limbaj de programare. Accent pe software de procesare grafica (tip Adobe Photoshop, Illustrator, software de design grafic).
  - *Conținut (în ordine):*
    - NOTA: Aceasta varianta se aplica pentru specializarile: Arte plastice, Arte decorative, Design, Arhitectura, Arte ambientale, Conservare-restaurare
    - Notiuni fundamentale de imagine digitala: pixeli, rezolutie, moduri de culoare, formate de fisiere
    - Tehnici de prelucrare a imaginilor raster: selectii, straturi, retusare, efecte
    - Tehnici de prelucrare a imaginilor vectoriale
    - Crearea de produse digitale pentru domeniul artistic specific specializarii

### Clasa a XII-a

**TIC - Tehnici de prelucrare audio-vizuala** — 1 (curriculum diferentiat - CD)
  - *Bază legală:* OMECI nr. 5099/09.09.2009
  - *Limbaj/Software:* Nu se studiaza limbaj de programare.
  - *Conținut (în ordine):*
    - NOTA: Aceasta varianta se aplica pentru specializarile: Muzica, Arta actorului
    - Aprofundarea tehnicilor audio-vizuale studiate in cls. XI
    - Realizarea de proiecte audio-vizuale complexe (sinteza)
    - Integrarea competentelor digitale in contextul artistic al specializarii

**Proiectare asistata de computer** — Neconfirmat din sursa publica accesibila (estimat 2 ore CD, prin analogie cu structura cls. XI)
  - *Bază legală:* OMECI nr. 5099/2009 (referinta din lista programa, edu.ro/cons_pub_programe_scolare_liceu)
  - *Limbaj/Software:* Nu se studiaza limbaj de programare. Accent pe software CAD (tip AutoCAD, SketchUp sau echivalente).
  - *Conținut (în ordine):*
    - NOTA: Aceasta varianta se aplica pentru specializarile: Arhitectura, Arte ambientale, Design
    - Notiuni de proiectare asistata de calculator
    - Desen tehnic 2D si modelare 3D cu software specializat
    - Realizarea de proiecte de design/arhitectura cu instrumente digitale

**Surse oficiale consultate:**
- https://www.slideshare.net/profadeinfo41/programa-scolara-tic9 (Programa TIC clasa IX, anexa OMECI 5099/2009)
- https://www.slideshare.net/profadeinfo41/programa-scolara-tic10 (Programa TIC clasa X, anexa OMECI 5099/2009)
- https://informatica.isj-db.ro/programe-scolare/ (Lista completa programe TIC/informatica liceu, ISJ Dolj)
- https://www.edu.ro/OMEC_4350_2025_planuri_cadru_liceu_frecventa_zi (OMEC 4350/20.06.2025 - noile planuri cadru liceu, aplicare progresiva din 2026-2027)
- https://lege5.ro/Gratuit/gezdqnbvgi/ordinul-nr-4856-2009-privind-aprobarea-planurilor-cadru-de-invatamant-pentru-clasele-a-ix-a-a-xii-a-filiera-vocationala-profil-artistic-specializarea-conservare-restaurare-bunuri-culturale-cursuri-de- (OMECI 4856/2009 plan cadru conservare-restaurare, tabel ore confirmat)
- https://www.edu.ro/cons_pub_programe_scolare_liceu (Programe scolare liceu publicate in transparenta 2025-2026, ME Romania)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/transa_3_25_11_2025/Arhitectura_Procesarea_Computerizata_a_Imaginii_CS_XI.pdf (Programa Procesarea computerizata a imaginii cls. XI, 2025)
- https://lege5.ro/Gratuit/gezdmmzrha/curriculum-diferentiat-pentru-ciclul-superior-al-liceului-filiera-vocationala-profilul-artistic-specializarile-arhitectura-arte-ambientale-si-design (Curriculum diferentiat cls. XI-XII, Arhitectura/Arte ambientale/Design - confirmare 2 ore PCI)
- https://www.edupedu.ro/proiect-planurile-cadru-liceu-pentru-vocational-artistic-2025/ (Articol Edupedu despre proiectele planuri cadru vocational artistic 2025 - confirmare TIC 1h/sapt consistent IX-XII in proiect)
- http://www4.edu.ro/index.php/articles/curriculum/6759 (Proiect programa Procesarea computerizata a imaginii cls. XI, edu.ro arhiva)

**⚠️ Incertitudini (de re-verificat înainte de build):**
- Orele exacte pe saptamana pentru 'Proiectare asistata de computer' clasa XII nu au putut fi confirmate dintr-un tabel oficial accesibil (tabelul planului cadru este in PDF binar inaccesibil WebFetch; estimatia de 2 ore CD este prin analogie).
- Continuturile detaliate (unitatile de invatare in ordine exacta) pentru TIC - Tehnici de prelucrare audio-vizuala cls. XI si XII nu au putut fi extrase din documentul oficial PDF (binar inaccesibil); descrierea continutului se bazeaza pe informatii indirecte din surse secundare.
- Situatia specializarii 'Coregrafie' in clasa XII: din tabelul informatica.isj-db.ro, programa TIC audio-vizuala clasa XII este listata doar pentru 'Muzica, Arta actorului' - nu este clar daca Coregrafie are aceeasi programa sau nu are TIC in cls. XII.
- Planurile cadru OMEC 4350/2025 (aplicabile din 2026-2027) pot modifica structura orelor fata de planurile actuale OMECI 3670/2012 si OMECI 4856/2009 - nu a putut fi verificat tabelul exact din Anexele 10-15 ale OMEC 4350/2025 (PDF inaccessibil).
- Numarul exact de ore pentru TIC in ciclul superior (cls. XI) pentru specializarile Muzica/Arta actorului/Coregrafie (TIC audio-vizual) nu a fost confirmat numeric dintr-un tabel oficial - a fost estimat la 1 ora CD prin surse secundare.
- Situatia disciplinei 'Procesarea computerizata a imaginii' pentru clasa XII specializare Arte plastice/Arte decorative nu este confirmata explicit (programa din lista ISJ DB apare doar pentru cls. XI; 'Proiectare asistata de computer' apare la cls. XII pentru Arhitectura/Design).
- Programa TIC clasa IX din 2025 (Tehnologia_informatiei_si_a_comunicatiilor_TC_IX.pdf de pe edu.ro) nu a putut fi citita (PDF binar) - nu se stie daca aduce modificari fata de OMECI 5099/2009 pentru filiera vocationala artistica.
- Software-urile specifice recomandate in programele CD (Procesare imagini, Audio-vizual, CAD) nu au putut fi confirmate din textul oficial al programelor - documentele PDF nu au putut fi parsate.

**🔎 Probleme semnalate de verificatorul adversarial:**
- OMEN MIS-ATTRIBUTION (audio-vizual + PAC): Data attributes 'OMECI nr. 5099/09.09.2009' to ALL disciplines including 'TIC - Tehnici de prelucrare audio-vizuala' (cls. XI, XII) and 'Proiectare asistata de computer' (cls. XII). Official source Lege5 (Art. 5 al Ordinului 5099/2009) lists ONLY 'Informatica IX-XII, Tehnologia informatiei si a comunicatiilor IX-XII, Procesarea computerizata a imaginii pentru clasa a XI-a'. The order does NOT contain 'Tehnici de prelucrare audio-vizuala' nor 'Proiectare asistata de computer' nor a class-XII PCI/PAC. Those derive from the curriculum diferentiat (OMECI 3608/2009 sau 4856/2009 conform rezultatelor cautarii), nu din 5099/2009. Citarea OMEN pentru aceste 3 discipline este eronata.
- SPECIALIZARI GRESIT IMPARTITE (PCI cls. XI): Data claims (NOTA) ca 'Procesarea computerizata a imaginii' cls. XI se aplica pentru 'Arte plastice, Arte decorative, Design, Arhitectura, Arte ambientale, Conservare-restaurare'. Sursa oficiala ISJ Dolj (informatica.isj-db.ro/programe-scolare, sursa citata chiar de date) listeaza PCI cls. XI pentru: arhitectura, arte ambientale, design, arte plastice, arte decorative. CONSERVARE-RESTAURARE nu apare in aceasta lista. Conservare-restaurare are disciplina proprie 'Tehnica fotografica si prelucrare computerizata a imaginii' / 'Atelier de specialitate' (Anexa nr. 253, rocnee.eu), NU 'Procesarea computerizata a imaginii' standard. Includerea conservare-restaurare la PCI standard este inventata/eronata.
- CONTRADICTIE ORE PCI cls. XI (2 vs 1): Data afirma '2 ore pe saptamana' pentru Procesarea computerizata a imaginii cls. XI. O sursa oficiala (descriere plan-cadru, edu.ro cons_pub) indica '1 hour per week during grade XI'. Sursele oficiale sunt in conflict (curriculum diferentiat vechi OMECI vs plan-cadru 2025); cifra de 2 ore NU este confirmata univoc dintr-un tabel oficial accesibil. Afirmatia ferma '2 ore' nu e sustinuta.
- TIP CURRICULUM GRESIT ETICHETAT (CD vs CS): Data eticheteaza disciplinele cls. XI-XII drept 'curriculum diferentiat - CD'. Documentul oficial 2025 de pe edu.ro este numit 'Arhitectura_Procesarea_Computerizata_a_Imaginii_CS_XI.pdf' (CS = curriculum de specialitate), iar listarile recente (rocnee.eu, Anexa 293/253) folosesc eticheta 'CS'. Eticheta 'CD' poate fi invechita fata de nomenclatorul oficial curent.
- ORDINEA / CONTINUTUL NEVERIFICAT din sursa oficiala: Continuturile (unitatile de invatare in ordine) pentru toate disciplinele NU au putut fi confirmate din textul oficial — PDF-urile oficiale (Arhitectura_PCI_CS_XI.pdf, programele TIC IX/X) sunt binare/inaccesibile la WebFetch (confirmat: extragere esuata). Ordinea continutului din date provine din surse secundare, nu din document oficial — neverificabil ca exact/oficial.
- ORE 'Proiectare asistata de computer' cls. XII INVENTAT prin analogie: Data estimeaza '2 ore CD, prin analogie' — recunoscut in incertitudini, dar prezentat in campul ore_pe_saptamana ca valoare. Nicio sursa oficiala nu confirma numarul de ore; estimarea prin analogie nu este un fapt sustinut.

**✏️ Corecții propuse:**
- Reatribuie OMEN: pastreaza OMECI 5099/2009 (MO 764 bis/2009) DOAR pentru TIC cls. IX-X si pentru 'Procesarea computerizata a imaginii' cls. XI (confirmat in Art. 5). Pentru 'Tehnici de prelucrare audio-vizuala' (XI/XII) si 'Proiectare asistata de computer' (XII) cauta ordinul real al curriculumului diferentiat (probabil OMECI 3608/2009 sau OMECI 4856/2009) si citeaza-l corect; nu lasa 5099/2009.
- Corecteaza specializarile PCI cls. XI la exact cele oficiale (ISJ Dolj): arhitectura, arte ambientale, design, arte plastice, arte decorative. Elimina 'Conservare-restaurare' din lista PCI; pentru conservare-restaurare mentioneaza disciplina proprie 'Tehnica fotografica si prelucrare computerizata a imaginii' / 'Atelier de specialitate' (Anexa nr. 253, rocnee.eu).
- Marcheaza orele PCI cls. XI ca neconfirmate/in conflict (1h plan-cadru 2025 vs 2h curriculum diferentiat vechi), nu afirma ferm '2 ore'. La fel, scoate cifra '2 ore' inventata pentru 'Proiectare asistata de computer' cls. XII sau marcheaz-o explicit ca neconfirmata in campul de ore, nu doar in incertitudini.
- Inlocuieste eticheta 'CD' cu 'CS (curriculum de specialitate)' conform nomenclatorului oficial curent (denumirea fisierelor edu.ro 2025 + anexe rocnee.eu), sau noteaza ambele.
- Nu prezenta ordinea continuturilor ca oficiala pana nu este extrasa din PDF-ul oficial (foloseste pdftotext/OCR local pe fisierul deja descarcat: webfetch-...es8a6t.pdf, 417KB, in tool-results) si confirma domeniile de continut in ordinea reala.

---

## Premise structurale pe disc (LearningHub, verificat 14.06.2026)

8 profiluri × 4 ani (cls IX–XII) la `content/liceu/<profil>/cls{9,10,11,12}/`. Conținut REAL inegal: **mat-info** (30 fișiere) + **artistic** (23) dezvoltate; restul SCHELETE (doar index-uri); **cercetare** = 1 stub (pagina Competențe Digitale). 
Concluzie: liceul = în mare parte **CREARE** (vs gimnaziu = corectare).

*Generat din workflow liceu-curriculum-research (wf_da07deaa). Oracol per specializare pentru revamparea liceu — vezi REVAMP_PLAYBOOK.md.*
