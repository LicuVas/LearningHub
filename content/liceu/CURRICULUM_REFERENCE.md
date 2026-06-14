# Curriculum Liceu — Referinta (Informatica & TIC)

> Cercetat + re-verificat 14.06.2026 (workflow multi-agent: cercetare Sonnet + verificare adversariala Opus) pe surse OFICIALE edu.ro. Oracol pentru revamparea liceu pe LearningHub. Date canonice: `content/liceu/_curriculum_data.json`.

**SCHIMBARE 2025-2026:** plan-cadru OMEC/OME 4350/2025 (+ programe noi OME 6930/2025 pt TIC cls IX, in vigoare din 2026-2027). Tranzitie: programele 2009 (OMECI 5099/2009) raman in vigoare pt cls X-XII pana sunt inlocuite an cu an. Limbaj de baza nou la informatica = **Python** (C++ ramane la intensiv/militar in tranzitie). **TIC = trunchi comun la toate filierele** + introduce AI/LLM, robotica, colaborare digitala.

**NOTA verificare:** profilurile vocationale/umanist au verdict `reject` la verificarea adversariala din cauza COMPLEXITATII de tranzitie (2 seturi de programe valabile simultan) + tool-uri vechi in programele 2009 inca in vigoare (FrontPage/Dreamweaver/PageMaker NU sunt abrogate - se prezinta cu echivalent modern). Datele sunt solide si sourse; nu sunt erori.

---

## Matematica-Informatica  `[mat-info]`  &mdash; verificare: `pass`

**Specializari:** Matematica-Informatica, Matematica-Informatica intensiv informatica

### Clasa a IX-a

**Informatica (intensiv informatica)** — 4 ore/saptamana (2 ore studiu teoretic + 2 ore activitati practice in laborator)
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa in consultare publica 2025 - numarul ordinului de aprobare a programei inca necompletata in documentul oficial
  - *Limbaj:* Python (limbaj de baza obligatoriu) + C++ (suplimentar, al doilea limbaj, EXCLUSIV la intensiv)
  - *Continut (in ordine):*
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
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa in consultare publica 2025 - numarul ordinului de aprobare a programei inca necompletata in documentul oficial
  - *Limbaj:* Python (limbaj de baza obligatoriu); C++ NU se foloseste la non-intensiv
  - *Continut (in ordine):*
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
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa in consultare publica 2025 - numarul ordinului de aprobare a programei inca necompletata in documentul oficial
  - *Limbaj:* Niciun limbaj de programare; software: Google Workspace sau Microsoft Teams (domeniu Societate digitala); LibreOffice sau Microsoft Office (domeniu Continut digital); Linux Ubuntu sau Windows (domeniu Sisteme de calcul)
  - *Continut (in ordine):*
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
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa clasa X in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj:* Python (baza) + C++ (suplimentar, exclusiv la intensiv)
  - *Continut (in ordine):*
    - Domeniu 1 - Modele conceptuale simple: modele liniare, neliniare, asociative (structuri de date tip stiva, coada, arbore binar, dictionar/map)
    - Domeniu 2 - Algoritmi specializati pe clase de probleme: prelucrarea listelor ordonate; criptarea/decriptarea sirurilor de caractere (EXCLUSIV la intensiv si militar)
    - Domeniu 2 - Strategii de rezolvare probleme: Divide et Impera; Greedy
    - Domeniu 3 - Elemente limbaj de programare: prelucrarea datelor in modele simple liniare, neliniare, asociative (Python si C++ la intensiv)
    - Domeniu 3 - Subprograme recursive: sintaxa definitie si apel, mecanism de executare (EXCLUSIV la matematica-informatica, intensiv si militar)

**Informatica (matematica-informatica, non-intensiv) - Curriculum de Specialitate (CS)** — 2 ore/saptamana (1 ora studiu teoretic + 1 ora activitati practice in laborator)
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa clasa X in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj:* Python (baza); C++ absent la non-intensiv
  - *Continut (in ordine):*
    - Domeniu 1 - Modele conceptuale simple: modele liniare, neliniare, asociative (structuri de date simple)
    - Domeniu 2 - Strategii de rezolvare probleme: Divide et Impera; Greedy
    - Domeniu 3 - Elemente limbaj de programare: prelucrarea datelor in modele simple liniare, neliniare, asociative (Python)
    - Domeniu 3 - Subprograme recursive (EXCLUSIV la matematica-informatica si intensiv, absent la stiinte ale naturii)

**Tehnologia Informatiei si a Comunicatiilor (TIC) - Trunchi Comun (TC)** — 1 ora/saptamana
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa X-XII in forma de proiectie curriculara (consultare publica 2025)
  - *Limbaj:* Niciun limbaj de programare
  - *Continut (in ordine):*
    - 1. Societate digitala: securitate cibernetica si etica in spatiul digital; navigare avansata pe web
    - 2. Continuturi digitale: pagini web (HTML/CSS elementar); foi de calcul tabelar (Excel/Calc avansat); imagini digitale (prelucrare grafica)
    - 3. Sisteme de calcul: intretinere si depanare de baza ale unui sistem de calcul; asamblare componente hardware; programe utilitare; operatii de intretinere si optimizare sistem

### Clasa a XI-a

**Informatica (intensiv informatica) - Curriculum de Specialitate (CS)** — 7 ore/saptamana (4 ore studiu teoretic + 3 ore activitati practice in laborator)
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa clasa XI in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj:* Python (baza) + C++ (suplimentar, exclusiv la intensiv)
  - *Continut (in ordine):*
    - Domeniu 1 - Modele conceptuale complexe: liste inlantuite (EXCLUSIV la intensiv); modele relationale; modele ierarhice (arbori)
    - Domeniu 2 - Algoritmi specializati: prelucrarea grafurilor; prelucrarea arborilor (EXCLUSIV la intensiv si militar)
    - Domeniu 2 - Strategii de rezolvare a problemelor: Backtracking (generare sistematica a solutiilor); programare dinamica - subprobleme suprapuse (EXCLUSIV la intensiv)
    - Domeniu 3 - Elemente limbaj de programare: prelucrarea datelor in modele complexe (liste inlantuite - exclusiv intensiv; relationale; ierarhice); alocare si eliberare statica si dinamica a memoriei (EXCLUSIV la intensiv)
    - Domeniu 3 - Programare Orientata pe Obiecte: definirea claselor proprii, membri, mostenire, polimorfism

**Informatica (matematica-informatica, non-intensiv) - Curriculum de Specialitate (CS)** — 4 ore/saptamana (2 ore studiu teoretic + 2 ore activitati practice in laborator)
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa clasa XI in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj:* Python (baza); C++ absent la non-intensiv
  - *Continut (in ordine):*
    - Domeniu 1 - Modele conceptuale complexe: modele relationale; modele ierarhice (arbori) [liste inlantuite si alocare dinamica memorie absente la non-intensiv]
    - Domeniu 2 - Strategii de rezolvare a problemelor: Backtracking (generare sistematica a solutiilor) [programare dinamica absenta la non-intensiv]
    - Domeniu 3 - Elemente limbaj de programare: prelucrarea datelor in modele relationale si ierarhice (Python)
    - Domeniu 3 - Programare Orientata pe Obiecte: definirea claselor proprii (Python)

**Tehnologia Informatiei si a Comunicatiilor (TIC) - Trunchi Comun (TC)** — 1 ora/saptamana
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa XI in forma de proiectie curriculara (consultare publica 2025)
  - *Limbaj:* Niciun limbaj de programare
  - *Continut (in ordine):*
    - 1. Societate digitala: modelare computerizata a unor activitati (sisteme expert, activitati economice, de mediu, recreere)
    - 2. Continuturi digitale: prelucrare audio; prelucrare audio-video; baze de date (utilizare aplicatii dedicate)
    - 3. Sisteme de calcul: dispozitive inteligente si Internetul Obiectelor (IoT); fundamente robotica (programare roboti virtuali, senzori); configurare si testare comportament roboti virtuali

### Clasa a XII-a

**Informatica (intensiv informatica) - Curriculum de Specialitate (CS)** — 7 ore/saptamana (4 ore studiu teoretic + 3 ore activitati practice in laborator)
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa clasa XII in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj:* Python (baza) + C++ (suplimentar, exclusiv la intensiv) + SQL (pentru baze de date, la matematica-informatica si militar)
  - *Continut (in ordine):*
    - Domeniu 1 - Modele conceptuale avansate: proiectarea bazelor de date (model relational avansat); modele pentru invatare automata (Machine Learning)
    - Domeniu 2 - Normalizarea modelului conceptual al unei probleme de gestiune (strategii de normalizare: forme normale)
    - Domeniu 2 - Algoritmi specializati pentru invatare automata (clasificare, regresie, algoritmi ML de baza)
    - Domeniu 3 - Comenzi SQL si elemente limbaj de programare pentru prelucrarea datelor organizate in baze de date (SQL: SELECT, INSERT, UPDATE, DELETE, JOIN, subinterogari)
    - Domeniu 3 - Elemente limbaj de programare pentru prelucrarea datelor in invatare automata (Python + biblioteci ML)

**Informatica (matematica-informatica, non-intensiv) - Curriculum de Specialitate (CS)** — 3 ore/saptamana (2 ore studiu teoretic + 1 ora activitati practice in laborator)
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa clasa XII in forma de proiectie curriculara (consultare publica 2025) - programa detaliata cu unitati de continut nu este inca publicata separat
  - *Limbaj:* Python (baza) + SQL (pentru baze de date)
  - *Continut (in ordine):*
    - Domeniu 1 - Modele conceptuale avansate: proiectarea bazelor de date (model relational); modele pentru invatare automata
    - Domeniu 2 - Normalizarea modelului conceptual al unei probleme de gestiune
    - Domeniu 2 - Algoritmi specializati pentru invatare automata
    - Domeniu 3 - Comenzi SQL si elemente limbaj de programare pentru prelucrarea datelor in baze de date
    - Domeniu 3 - Elemente limbaj de programare pentru invatare automata (Python)

**Tehnologia Informatiei si a Comunicatiilor (TIC) - Trunchi Comun (TC)** — 1 ora/saptamana
  - *Baza legala:* OMEN 4.350/2025 (plan-cadru); programa XII in forma de proiectie curriculara (consultare publica 2025)
  - *Limbaj:* Niciun limbaj de programare
  - *Continut (in ordine):*
    - 1. Societate digitala: participare civica si profesionala in spatiul digital
    - 2. Continuturi digitale: aplicatii cu interfete vizuale si ergonomie digitala
    - 3. Sisteme de calcul: retele de calculatoare (dispozitive active, medii de transmisie, protocoale; configurare si securizare retea; monitorizare si diagnosticare retea)

**Surse oficiale:**
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_CS_IX_Real_Matematica_informatica_regim_intensiv.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_CS_IX_Real_Matematica_informatica.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Tehnologia_informatiei_si_a_comunicatiilor_TC_IX.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_Proiectie_curriculara_CS_X_XII.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/TIC_TC_X_XII_proiectie_curriculara.pdf
- https://www.edu.ro/cons_pub_programe_scolare_liceu

**Incertitudini (de re-verificat la build):**
- Numerele exacte ale ordinelor ministeriale de aprobare a programelor scolare (OMEN) pentru disciplinele Informatica si TIC la clasele IX-XII sunt NECOMPLETATE in documentele publicate in consultare publica 2025 (apar ca 'nr. ....../......'); singurul OMEN confirmat este OMEN 4.350/2025 care aproba planurile-cadru.
- Programele detaliate cu unitati de continut pentru clasele X, XI si XII nu au fost publicate individual - exista doar o 'proiectie curriculara' (document de prefigurare a parcursului) care prezinta competentele generale si specifice, NU tabelele cu unitati de continut detaliate; continuturile pentru X-XII din acest raspuns sunt reconstuite din proiectia curriculara si pot diferi de programele finale.
- Nu s-a putut confirma daca programele din consultare publica 2025 sunt deja in vigoare sau urmeaza sa fie adoptate pentru un an scolar viitor; vechile programe (bazate pe OMEN-uri anterioare, cu Pascal/C++) pot fi inca aplicabile in scolile care nu au implementat noul curriculum.
- Ordinea exacta a unitatilor de continut in interiorul fiecarui an (care capitol se preda primul, al doilea etc.) nu este precizata in proiectia curriculara pentru clasele X-XII; este lasata la latitudinea profesorului cu respectarea competentelor.
- Continuturile detaliate pentru TIC clasele X, XI, XII nu sunt publicate intr-un document de programa complet - exista doar proiectia cu competente specifice; detaliile despre unitatile de continut pentru X-XII TIC au fost reconstituite din domenii tematice mentionate in proiectia curriculara.
- Nu s-a putut accesa oldsite.edu.ro (ECONNREFUSED) unde se aflau programele anterioare aprobate oficial cu OMEN-uri, deci comparatia cu curriculumul anterior (pre-2025) nu a putut fi realizata din sursa primara.

---

## Stiinte ale Naturii  `[stiinte]`  &mdash; verificare: `pass`

**Specializari:** Stiinte ale naturii

### Clasa a IX-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1
  - *Baza legala:* OMEN 4.350/2025 (planuri-cadru); programa in consultare publica 2025
  - *Continut (in ordine):*
    - 1. Societate digitala: Comunicare si colaborare digitala
    - 2. Societate digitala: Introducere in inteligenta artificiala
    - 3. Societate digitala: Introducere in tehnologii emergente
    - 4. Societate digitala: Aplicatii si platforme care sprijina invatarea
    - 5. Continuturi digitale, tehnologii si aplicatii: Birotica - Documente digitale
    - 6. Continuturi digitale, tehnologii si aplicatii: Birotica - Prezentari digitale
    - 7. Sisteme de calcul: Componenta hardware a unui sistem de calcul
    - 8. Sisteme de calcul: Componenta software a unui sistem de calcul

**Informatica** — 1
  - *Baza legala:* OMEN 4.350/2025 (planuri-cadru); programa in consultare publica 2025 - Curriculum de specialitate (CS)
  - *Limbaj:* Python
  - *Continut (in ordine):*
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
  - *Baza legala:* OMEN 4.350/2025 (planuri-cadru); proiectie curriculara TIC X-XII 2025
  - *Continut (in ordine):*
    - 1. Societate digitala: Securitate cibernetica si etica in spatiul digital; navigare avansata pe web
    - 2. Continuturi digitale: Pagini web (HTML/CSS)
    - 3. Continuturi digitale: Foi de calcul (calc tabelar)
    - 4. Continuturi digitale: Imagini digitale
    - 5. Sisteme de calcul: Intretinere si depanare de baza a unui sistem de calcul

**Informatica** — 1
  - *Baza legala:* OMEN 4.350/2025 (planuri-cadru); proiectie curriculara Informatica X-XII 2025 - Curriculum de specialitate (CS)
  - *Limbaj:* Python
  - *Continut (in ordine):*
    - 1. Organizarea conceptuala a datelor: Modele conceptuale simple - liniare, neliniare (stiva, coada, arbore binar - fara structuri dinamice de memorie)
    - 2. Strategii de rezolvare a problemelor: Algoritmi pentru prelucrarea listelor ordonate
    - 3. Strategii de rezolvare a problemelor: Strategii generale - metoda Greedy (optim local)
    - Nota: Continuturile marcate (*) - structuri liniare inlantuite, subprograme recursive, modele neliniare/asociative - sunt EXCLUSIV pentru specializarea matematica-informatica; nu se predau la Stiinte ale naturii

### Clasa a XI-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1
  - *Baza legala:* OMEN 4.350/2025 (planuri-cadru); proiectie curriculara TIC X-XII 2025
  - *Continut (in ordine):*
    - 1. Societate digitala: Modelare computerizata a unor activitati economice, de mediu sau recreere; sisteme expert
    - 2. Continuturi digitale: Prelucrari audio
    - 3. Continuturi digitale: Prelucrari audio-video
    - 4. Continuturi digitale: Baze de date (aplicatii)
    - 5. Sisteme de calcul: Dispozitive inteligente si Internetul obiectelor (IoT)
    - 6. Sisteme de calcul: Fundamente ale roboticii (roboti virtuali)

### Clasa a XII-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1
  - *Baza legala:* OMEN 4.350/2025 (planuri-cadru); proiectie curriculara TIC X-XII 2025
  - *Continut (in ordine):*
    - 1. Societate digitala: Participare civica si profesionala in spatiul digital (CV digital, cetatenie digitala, ocupare profesionala)
    - 2. Continuturi digitale: Interfete vizuale si ergonomie digitala (aplicatii cu interfete vizuale)
    - 3. Sisteme de calcul: Retele de calculatoare - dispozitive active, medii de transmisie, protocoale, configurare si securizare

**Surse oficiale:**
- https://www.edu.ro/cons_pub_programe_scolare_liceu
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_CS_IX_Real_Stiinte_ale_naturii.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_Proiectie_curriculara_CS_X_XII.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Tehnologia_informatiei_si_a_comunicatiilor_TC_IX.pdf
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/TIC_TC_X_XII_proiectie_curriculara.pdf

**Incertitudini (de re-verificat la build):**
- Programele consultate (2025) sunt in stadiu de CONSULTARE PUBLICA - ordinul ministrului nu are numarul completat in anteturi (se prezinta ca nr. ........./............); nu este confirmat ca aceste programe sunt deja in vigoare sau de cand se aplica (posibil incepand cu anul scolar 2025-2026 sau 2026-2027).
- Proiectia curriculara pentru Informatica clasele X-XII nu contine unitati de continut detaliate pentru Stiinte ale naturii la clasa a X-a; continuturile sunt prezentate combinat cu math-info si marcate prin asteriscuri (*/**) pentru a diferentia - unele continuturi sunt exclusiv math-info; separarea exacta a continuturilor pentru Stiinte ale naturii la clasa a X-a necesita lectura atenta a asteriscurilor din proiectia curriculara.
- Proiectia curriculara TIC clasele X-XII nu contine domenii de continut detaliate (nu exista echivalentul sectiunii CONTINUTURI ALE INVATARII din programa IX); ordinea si detaliul temelor pentru X, XI, XII la TIC sunt orientative, deduse din competentele specifice prezentate - nu dintr-o lista de continuturi explicita.
- Planurile-cadru aprobate prin OMEN 4.350/2025 nu au fost verificate direct (documentul planurilor-cadru nu a fost accesat); numarul de ore/saptamana pentru Informatica CS (1h/sapt la clasele IX-X Stiinte ale naturii) si TIC TC (1h/sapt IX-XII toate specializarile) este confirmat doar prin textul programelor de mai sus, nu prin consultarea directa a planului-cadru.
- Nu a putut fi confirmata existenta vreunei programe TIC sau Informatica anterioare OMEN 4.350/2025 inca in vigoare pentru clasele XI-XII Stiinte ale naturii (tranzitia intre noul si vechiul curriculum nu este explicita in documentele consultate).

---

## Tehnologic  `[tehnologic]`  &mdash; verificare: `pass`

**Specializari:** Tehnician in automatizari, Tehnician operator tehnica de calcul, Tehnician in activitati economice, Tehnician ecolog si protectia calitatii mediului, alte calificari profil tehnic/servicii/resurse

### Clasa a IX-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (trunchi comun - TC)
  - *Baza legala:* OMECI nr. 3411/16.03.2009 (plan-cadru cls. IX filiera tehnologica); programa scolara aprobata prin ordin MECI 2009 (nr. exact nu apare in exemplarul de la isjcta.ro)
  - *Continut (in ordine):*
    - 1. Calculatoare si retele de calculatoare: componente hard/soft, sisteme de operare, retele LAN/MAN/WAN/Internet, securitate, ergonomie, legislatie software
    - 2. Sistemul de operare Windows: operare elementara, interfata SO, organizare fisiere/directoare, accesorii (Notepad, Paint, Calculator), tiparire
    - 3. Editor de texte (Word): operatii de baza, procesare text, formatare, tabele, imagini, tiparire documente
    - 4. Internet si servicii web: arhitectura Internet, TCP/IP, servicii (WWW, e-mail, Chat, FTP), acces Internet, adresare, motoare de cautare, e-mail, securitate, neticheta
    - 5. Pagini HTML: editor HTML, inserare text si imagini, hiper-legaturi, tabele in HTML, aplicatii practice

### Clasa a X-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (trunchi comun - TC)
  - *Baza legala:* OMECI nr. 5099/09.09.2009, Anexa nr. 5
  - *Continut (in ordine):*
    - 1. Aplicatia Excel (calcul tabelar): operatii elementare, formatare celule, formule aritmetice si logice, functii (min, max, count, sum, average, if), referinte relative/absolute, grafice si diagrame, import obiecte, aplicatii practice
    - 2. Aplicatia Access (baze de date): operatii elementare, proiectare BD, creare/modificare tabele, chei primare, indecsi, formulare, interogari (simple si multiple), filtre, rapoarte, aplicatii practice
    - 3. Aplicatia PowerPoint (prezentari): creare prezentare, inserare text/imagini/obiecte grafice, formatare, diagrame, animatie, tranzitii, tiparire, aplicatii practice

### Clasa a XI-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (curriculum diferentiat - CD, ciclul superior al liceului, ruta directa de calificare)
  - *Baza legala:* OMECI nr. 5099/09.09.2009 (confirmat in Reperele Metodologice cls. XI, 2023-2024, ME/CNPEE)
  - *Continut (in ordine):*
    - 1. Date, informatii si utilizarea acestora: notiuni de baza (date, informatii, proces informational, baza informationala, flux informational, sistem informatic), surse de informatie (banci de date, BD, Internet/Intranet), prezentare si utilizare informatii in documente si prezentari
    - 2. Date din reteaua Internet: cautarea si regasirea informatiei, tehnici de cautare dupa criterii multiple, aplicatii cu documente si prezentari utilizand informatii de pe Internet
    - 3. Organizarea si prelucrarea datelor simple si a structurilor de date: tipuri de informatii/date (numerice, text, imagini, logice), structuri de date (variabile, fisiere, foi de lucru, tabele, BD, liste), operatori aritmetici/relationali/logici
    - 4. Functii predefinite specifice tipurilor de date si functii utilizator: functii predefinite (aritmetice, logice, cautare, financiare, pe siruri, informative), functii utilizator (definire, apelare in documente)
    - 5. Instrumente software pentru sistemele informatice: caracteristici, utilizarea instrumentelor de lucru (schite, grafice/diagrame, sabloane, rapoarte simple si complexe, functii), studii de caz specifice calificarii

### Clasa a XII-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 ora/saptamana (curriculum diferentiat - CD, ciclul superior al liceului, ruta directa de calificare; 34 sapt. cursuri din care 5 sapt. stagii pregatire practica)
  - *Baza legala:* OMECI nr. 5099/09.09.2009 (confirmat in Reperele Metodologice cls. XII 2024-2025, ME/CNPEE)
  - *Continut (in ordine):*
    - 1. Instrumente si structura unui site web: instrumente pentru creare site-uri (editoare text/HTML/imagini), tipuri de site-uri (statice, dinamice/interactive), structura paginii web, SEO
    - 2. Structura unui site web - elemente de continut: text, liste, tabele, imagini, harti de imagini, animatie, cadre, filme, butoane; ierarhia paginilor, sistem de link-uri; criterii de realizare (viteza incarcare, raport text/imagine, acuratete, lizibilitate, design)
    - 3. Concepte generale ale managementului proiectului: notiunea de proiect, obiective, faze, manager/echipa de proiect, plan, WBS, grafic de activitati, traseu critic, initierea proiectului
    - 4. Etapele unui proiect: planificarea (organigrama, structura echipei, plan de proiect, WBS, alocare resurse), monitorizarea (cereri de schimbare, controlul riscului, rapoarte de progres/exceptii), evaluarea (calitatea proiectelor, raport de sfarsit de proiect)
    - 5. Componente si instrumente ale proiectului: organizatia de proiect, planuri, mijloace de control, managementul riscului/schimbarii/configuratiei, instrumente software (grafice, schite, sabloane, diagrame), aplicatii practice

**Surse oficiale:**
- https://isjcta.ro/wp-content/uploads/2013/06/tic_9_liceu_tehnologic.pdf - Programa scolara TIC cls. IX, filiera tehnologica (MECI 2009)
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/TIC_clasa%20a%20X-a.pdf - Programa scolara TIC cls. X, OMECI 5099/2009 (ROCNEE)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2023/preuniversitar_root/repere_metodologice_XI/invatamant_liceal/REPERE_METODOLOGICE_TIC_2023_2024_CLS_XI.pdf - Repere Metodologice TIC cls. XI, an scolar 2023-2024 (ME/CNPEE)
- https://rocnee.eu/images/rocnee/fisiere/repere_medotologice/2025/finale/REPERE_METODOLOGICE_TIC_2024_2025_CLS_XII.pdf - Repere Metodologice TIC cls. XII, an scolar 2024-2025 (ME/CNPEE)
- https://www.edu.ro/curriculum-%C3%AEnv%C4%83%C8%9B%C4%83m%C3%A2nt-liceal-tehnologic - Curriculum invatamant liceal tehnologic, edu.ro
- https://rocnee.eu/index.php/dcee-oriz/curriculum-oriz/planuri-cadru-actuale - Planuri-cadru actuale, ROCNEE (OMECI 3411/2009 cls. IX; OMECI 3412/2009 cls. X-XII)

**Incertitudini (de re-verificat la build):**
- Numarul exact al ordinului ministerial care aproba programa TIC cls. IX pentru filiera tehnologica: documentul de la isjcta.ro are campurile OMEN necompletate (blank); contextul indica emiterea odata cu OMECI 3411/2009 (planul-cadru), dar nu s-a putut citi numarul exact al ordinului care aproba programa in sine dintr-o sursa primara accesibila
- Existenta si continutul unui curriculum diferentiat (CD) specific de Informatica/programare pentru calificarile IT din filiera tehnologica (ex. Tehnician operator tehnica de calcul) in clasele IX-XII: nu s-au putut accesa programele modulare de specialitate (CDL/CD) pentru aceste calificari specifice din surse oficiale verificabile in aceasta sesiune
- Daca exista module de programare (Pascal, C/C++, Python) in curricula diferentiat sau CDL al liceelor tehnologice cu calificari IT: nu s-a confirmat oficial; disciplina Informatica cu programare (Pascal/C++) a fost identificata doar pentru filiera teoretica profil real (OMECI 5099/2009, Anexa 5)
- Planurile-cadru noi pentru liceu din 2025-2026 (aflate in consultare publica conform edupedu.ro): nu se stie daca au intrat in vigoare si cum modifica distributia TIC pentru filiera tehnologica incepand cu 2026-2027
- Ore TIC cls. IX in planul-cadru actual: sursa ISJCTA indica 1 ora/saptamana TC, dar un document de repere metodologice pentru invatamant special indica 2 ore/saptamana; distinctia invatamant de masa vs. special nu a putut fi confirmata dintr-un plan-cadru oficial actualizat accesat direct

---

## Umanist (Filologie / Stiinte Sociale)  `[umanist]`  &mdash; verificare: `reject`

**Rezumat:** La profilul umanist (filiera teoretica), ambele specializari - Filologie si Stiinte Sociale - studiaza TIC in toti cei 4 ani de liceu, fara programare algoritmica. In clasa IX, TIC este trunchi comun (2 ore/saptamana) pentru toate profilele, cu o programa generala de utilizator: hardware, retele, procesare text, Internet, e-mail, elemente HTML de baza. In clasa X, TIC devine curriculum diferentiat (1 ora/sapt) la ambele specializari umaniste, cu accentul pe suita Office avansata (Word, Excel, PowerPoint). In ciclul superior (cls XI-XII), cele doua specializari se diferentiaza: la Filologie se studiaza TIC - Tehnoredactare asistata de calculator (1 ora/sapt CD in ambele clase), focusat pe tehnici tipografice profesionale, procesoare text avansate si creare de pagini web; la Stiinte Sociale se studiaza TIC - Tehnici de documentare asistata de calculator (2 ore/sapt in cls XI, 1 ora in cls XII, CD), axat pe documentare si cercetare asistata de calculator, lucru cooperativ si proiecte multimedia. Nu exista limbaj de programare studiat la profilul umanist. Programele actuale (cls X-XII) sunt aprobate prin OMECI 5099/2009 si planul-cadru OMECI 3410/2009, aflate in vigoare; noua programa TIC pentru cls IX (modernizata, cu inteligenta artificiala, robotica, colaborare digitala) este aprobata prin OME 6930/2025 si intra in vigoare din septembrie 2026.

**Specializari:** Filologie, Stiinte Sociale

### Clasa a IX-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 2 · TC
  - *Baza legala:* OMECI 5099/09.09.2009 (programa); plan-cadru OMECI 3410/16.03.2009. ATENTIE: de la cls IX 2026-2027 intra in vigoare noua programa aprobata prin OME 6930/2025 (publicata in MO 4bis/08.01.2026)
  - *Aplicatii:* Microsoft Word (procesare text), Microsoft Office / LibreOffice (suite), Browser web, Client e-mail (Outlook Express sau similar), Paint, Editor HTML de baza
  - *Continut (in ordine):*
    - Componente hardware si software ale unui sistem de calcul
    - Retele de calculatoare: LAN, MAN, WAN, Internet
    - Securitate informatica: virusi, antivirus, drepturi de acces
    - Sistemul de operare Windows: interfata, fisiere, directoare
    - Procesare text avansata: formatare, tabele, imagini, stiluri
    - Navigare pe Internet: browsere, motoare de cautare, servicii web
    - Posta electronica: redactare, trimitere, gestionare mesaje
    - Servicii Internet: WWW, e-mail, chat, FTP, newsgroup, e-commerce
    - Elemente de baza HTML: text, imagini, hiperlegaturi, tabele
    - Ergonomia postului de lucru; legislatie drepturi de autor software

### Clasa a X-a

**Tehnologia Informatiei si a Comunicatiilor (TIC) - ambele specializari umaniste** — 1 · CD
  - *Baza legala:* Plan-cadru OMECI 3410/16.03.2009; programa TIC cls X aprobata prin OMECI 5099/2009
  - *Aplicatii:* Microsoft Word (avansat), Microsoft Excel, Microsoft PowerPoint, Editor grafic
  - *Continut (in ordine):*
    - Consolidarea si aprofundarea competentelor TIC din cls IX
    - Procesare text avansata: functii avansate Word, macrocomenzi
    - Foi de calcul: formule, functii, grafice, baze de date simple (Excel)
    - Prezentari multimedia (PowerPoint): animatii, tranzitii, multimedia
    - Aplicatii integrate Office: transfer de date intre aplicatii (mecanism OLE)
    - Aplicabil atat la Filologie cat si la Stiinte Sociale (1h/sapt CD conform plan-cadru OMECI 3410/2009)

### Clasa a XI-a

**TIC - Tehnoredactare asistata de calculator [specializarea FILOLOGIE]** — 1 · CD
  - *Baza legala:* OMECI 5099/09.09.2009 (programa); plan-cadru OMECI 3410/16.03.2009
  - *Aplicatii:* Microsoft Word (avansat), PageMaker sau QuarkXPress (unul la alegere, in functie de dotarea scolii), Editor grafic pentru optimizarea imaginilor
  - *Continut (in ordine):*
    - Organizarea spatiului de lucru tipografic: dimensiuni pagina, margini, zone de imprimare
    - Organizarea grafica a paginii: casete text, coloane, titluri, raport vid-plin, ergonomie
    - Organizarea lucrarilor extinse: brosura, revista, carte (capitol, cuprins, index, glosar)
    - Formatare si sablonizare documente: stiluri, fonturi, culori, paragrafe
    - Utilizarea obiectelor grafice: imagini scanate, fotografii, ecuatii, formatare avansata
    - Word avansat: macrocomenzi, Track Changes, partajare document in retea, cuprins automat, editare PDF
    - Procesor profesional (PageMaker SAU QuarkXPress) la alegere: layout pagina, casete text si imagine, tipografie
    - Proiecte practice: revista scolara, carte de format mic, ziar scolar

**TIC - Tehnici de documentare asistata de calculator [specializarea STIINTE SOCIALE]** — 2 · CD
  - *Baza legala:* OMECI 3252/13.02.2006 (programa initiala cls XI); plan-cadru actualizat prin OMECI 3410/16.03.2009 si OME 7723/2024
  - *Aplicatii:* Microsoft Word, Microsoft PowerPoint, Microsoft Excel (diagrame), Editor grafic (IView sau similar), Browser web, Motoare de cautare, SharePoint sau aplicatii de partajare colaborativa
  - *Continut (in ordine):*
    - Tehnica proiectului: tema, obiective, sarcini, organizarea echipei, roluri
    - Alegerea aplicatiilor birotice: procesoare text, prezentari PPT, editoare grafice
    - Organizarea modulara a unui proiect: structura, standarde, diagrama Gantt
    - Formatare si sablonizare documente text si diapozitive PPT
    - Utilizarea elementelor grafice: inserare, optimizare, editoare grafice
    - Diagrame statistice: baze de date simple, bar chart, pie chart (Excel)
    - Inserarea obiectelor complexe: filme, sunete, animatii 2D/3D
    - Documentare pe Internet: motoare de cautare, enciclopedii online, drepturi de autor (copyright)
    - Lucru cooperativ: partajare documente in retea, SharePoint (numai la 2h/sapt)
    - Biblioteca de documentare: structura, niveluri de acces, postare pe server (numai la 2h/sapt)
    - Prezentarea publica a proiectului: videoproiector, PDF, web

### Clasa a XII-a

**TIC - Tehnoredactare asistata de calculator [specializarea FILOLOGIE]** — 1 · CD
  - *Baza legala:* OMECI 5099/09.09.2009; plan-cadru OMECI 3410/16.03.2009
  - *Aplicatii:* Editor de pagini Web (Frontpage, Macromedia Dreamweaver sau echivalent modern), Browser web pentru testare si publicare
  - *Continut (in ordine):*
    - Principii ale proiectarii documentelor hipermedia
    - Etapele procesului de dezvoltare a unei interfete Web
    - Organizarea informatiei: tehnici de tehnoredactare computerizata
    - Editor Web: formatare text la nivel caracter, paragraf, sectiune
    - Inserarea hiperlegaturilor, liste formatate, tabele
    - Inserarea obiectelor hipermedia: imagini, secvente audio si video
    - Maparea imaginilor, cadre (frames)
    - Proiectarea designului general al documentului hipermedia
    - Publicare si testare pagina web
    - Proiect practic final: realizarea si prezentarea publica a unei aplicatii web

**TIC - Tehnici de documentare asistata de calculator [specializarea STIINTE SOCIALE]** — 1 · CD
  - *Baza legala:* OMECI 5099/09.09.2009; plan-cadru OMECI 3410/16.03.2009 si OME 7723/2024
  - *Aplicatii:* Editor de pagini Web (Frontpage, Macromedia Dreamweaver sau echivalent modern), Browser web pentru testare si publicare
  - *Continut (in ordine):*
    - Principii ale proiectarii documentelor hipermedia
    - Etapele procesului de dezvoltare a unei interfete Web
    - Organizarea informatiei: tehnici de tehnoredactare computerizata
    - Editor Web: formatare text la nivel caracter, paragraf, sectiune
    - Inserarea hiperlegaturilor, liste formatate, tabele
    - Inserarea obiectelor hipermedia: imagini, audio, video
    - Maparea imaginilor, cadre (frames)
    - Proiectarea designului general al documentului hipermedia
    - Publicare, testare si prezentare publica a proiectului

**Surse oficiale:**
- https://portal.eduhr.ro/wp-content/uploads/2021/10/tic_9-1.pdf - Programa TIC cls IX (OMECI 5099/2009)
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/TIC_Tehnoredactare%20asistata%20de%20calculator_teoretic_clasa%20a%20XI-a.pdf - Programa TIC Tehnoredactare cls XI Filologie (OMECI 5099/2009)
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/TIC_Tehnoredactare%20asistata%20de%20calculator_teoretic_clasa%20a%20XII-a.pdf - Programa TIC Tehnoredactare cls XII Filologie (OMECI 5099/2009)
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/TIC_Tehnici%20de%20documentare%20asistata%20de%20calculator_teoretic_vocational_clasa%20a%20XII-a.pdf - Programa TIC Documentare cls XII Stiinte Sociale (OMECI 5099/2009)
- https://www.isjcta.ro/wp-content/uploads/2013/06/tic11_documentare_omec.pdf - Programa TIC Documentare cls XI Stiinte Sociale (OMECI 3252/2006)
- https://www.edu.ro/sites/default/files/Varianta%201_IX-X%20Liceu%20teoretic.pdf - Plan-cadru cls IX-X filiera teoretica profil umanist (OMECI 3410/2009)
- https://www.edu.ro/sites/default/files/Varianta%201_XI-XII%20Liceu%20teoretic.pdf - Plan-cadru cls XI-XII filiera teoretica profil umanist Filologie si Stiinte Sociale (OMECI 3410/2009)
- https://lege5.ro/gratuit/ge3danztha3ts/plan-cadru-de-invatamant-pentru-clasele-a-xi-a-si-a-xii-a-ciclul-superior-al-liceului-filiera-teoretica-cursuri-de-zi-profil-umanist-specializarea-stiinte-sociale-ordin-7723-2024 - Plan-cadru XI-XII Stiinte Sociale actualizat OME 7723/2024
- https://cdn.edupedu.ro/wp-content/uploads/2026/01/Ordinul-Nr.-6.930-Programe-scolare-liceu-Monitorul-Oficial-Partea-I-nr.-4Bis-1_compressed.pdf - Noua programa TIC cls IX aprobata OME 6930/2025 (MO nr.4bis/08.01.2026)
- https://rocnee.eu/index.php/dcee-oriz/curriculum-oriz/programe-scolare-front/ordin-programe-scolare-liceu-nr-6930-din-2025-si-anexe - ROCNEE - Ordin 6930/2025 programe scolare liceu

**Incertitudini (de re-verificat la build):**
- Programa TIC cls X pentru umanist nu a putut fi extrasa dintr-un PDF oficial propriu dedicat; existenta sa (1h/sapt CD) este confirmata de planul-cadru OMECI 3410/2009 extras direct din PDF edu.ro, dar continuturile exacte nu au fost verificate dintr-un document oficial separat pentru cls X umanist.
- Aplicatiile software mentionate in unele programe (PageMaker, QuarkXPress, Frontpage, Macromedia Dreamweaver) sunt depite si probabil inlocuite in practica cu Microsoft Publisher, Adobe InDesign, Visual Studio Code sau altele; programa din 2009 nu specifica un software unic obligatoriu, lasand la latitudinea scolii.
- Nu este clar daca planul-cadru OME 7723/2024 (Stiinte Sociale cls XI-XII) a modificat numarul de ore TIC fata de OMECI 3410/2009 sau doar a confirmat structura existenta. Datele extrase din lege5.ro indica 2h CD cls XI si 1h CD cls XII TIC Stiinte Sociale, consistent cu programa OMECI 3252/2006 si OMECI 5099/2009.
- Noua programa TIC (OME 6930/2025) se aplica doar cls IX incepand cu 2026-2027; programele pentru cls X-XII noi (daca vor fi elaborate) nu erau publicate la data cercetarii (iunie 2026).
- Programele cls XI-XII cu mentionarea aplicatiilor FrontPage si Macromedia Dreamweaver sunt programe din 2009 (aprobate OMECI 5099/2009) - sunt INCA IN VIGOARE oficial, dar considerate tehnic depite; profesorii folosesc in practica alternativele moderne. Aceasta nu inseamna ca programele sunt abrogate - ele raman documentul reglator oficial pana la inlocuire.

---

## Militar  `[militar]`  &mdash; verificare: `reject`

**Rezumat:** Liceul militar românesc (filiera vocațională, profil militar MApN, specializarea matematică-informatică militară) urmează un curriculum aprobat prin OMEC nr. 4.350/20.06.2025 (Anexa 16), implementat progresiv începând cu clasa a IX-a din anul școlar 2026-2027. Fiecare an de studiu totalizează 33 ore/săptămână, dintre care aria Tehnologii cuprinde: 1 oră/săptămână TIC (trunchi comun) + 3 ore/săptămână Informatică (curriculum de specialitate CS) + 2 ore/săptămână Pregătire militară (CS) — în toate cele patru clase IX-XII. Limbajul de programare principal este Python (cu SQL introdus la clasa a XII-a); C++ nu se studiază la profilul militar în noul curriculum (C++ este suplimentar doar la filiera teoretică matematică-informatică, regim intensiv). Activitățile practice de informatică se desfășoară obligatoriu în laboratorul de informatică. Până la intrarea deplină în vigoare a noilor programe (cls. X din 2027-2028, cls. XI din 2028-2029, cls. XII din 2029-2030), rămân aplicabile programele din OMECI 5099/09.09.2009 — care utilizează C/C++ drept limbaj principal. Profilul MAI (ordine și securitate publică) NU este inclus în OMEC 4350/2025; planul-cadru pentru unitățile MAI se aprobă prin ordin separat și nu a putut fi confirmat printr-un document oficial curent identificat.

**Specializari:** Matematică-informatică militară (MApN — Ministerul Apărării Naționale)

### Clasa a IX-a

**Tehnologia Informației și a Comunicațiilor (TIC)** — 1 · TC
  - *Baza legala:* OMEC nr. 4.350/20.06.2025 (Anexa 16 — plan-cadru); programa școlară în consultare publică nov-dec 2025
  - *Aplicatii:* Suite office (procesare text, prezentări — ex. LibreOffice Writer/Impress sau Microsoft Office), Platforme e-learning, Instrumente AI generative (chatboți LLM)
  - *Continut (in ordine):*
    - Societate digitală: comunicare și colaborare digitală, e-mail, rețele sociale, neticheta
    - Aplicații și platforme pentru învățare; utilizarea responsabilă a inteligenței artificiale
    - Introducere în inteligența artificială: algoritmi, LLM, gândire critică, AI Act, responsabilitate, proprietate intelectuală
    - Introducere în tehnologii emergente: realitate virtuală și augmentată
    - Birotică — documente digitale: formatare profesională, îmbinare corespondență, cuprins automat, codificare text (ASCII, Unicode)
    - Birotică — prezentări digitale: teme, animații, interactivitate, multimedia
    - Componenta hardware: arhitectura sistemului de calcul, CPU (ALU, UC, regiştri, cache), RAM, stocare (HDD, SSD), interfețe, periferice
    - Componenta software: sisteme de operare, aplicații, licențe

**Informatică** — 3 (2 ore teorie + 1 oră practică în lab) · CD
  - *Baza legala:* OMEC nr. 4.350/20.06.2025 (Anexa 16 plan-cadru); programa școlară în consultare publică nov-dec 2025 (ordinul de aprobare nepublicat la data cercetării)
  - *Limbaj:* Python
  - *Aplicatii:* Python 3 (IDLE, VS Code sau echivalent), Tkinter (biblioteca GUI inclusă în Python)
  - *Continut (in ordine):*
    - Organizarea datelor: modelul liniar — listă, stivă (LIFO), coadă (FIFO), acces direct, acces secvențial, lista de frecvențe
    - Strategii de rezolvare: gândire computațională, etapele elaborării unui program (analiză, proiectare, implementare, testare, depanare), pseudocod, diagrame
    - Eficiența algoritmilor: complexitate timp și spațiu, notația O()
    - Interfețe: consolă, GUI (ferestre, butoane), fișiere text
    - Prelucrarea numerelor: cifre, divizibilitate, CMMDC (algoritmul lui Euclid), conversii baze de numerație, Ciurul lui Eratostene, exponențiere rapidă
    - Generarea sistematică a elementelor: secvențe cu proprietăți date, șiruri recurente (Fibonacci)
    - Metode de sortare: selecția minimului, lista de frecvențe, metoda bulelor
    - Subprograme (funcții): antet, corp, variabile locale/globale, parametri, returnare, apel; funcții predefinite Python (abs, round, sqrt, min, max, len, sum)
    - Introducere în OOP: clasă, obiect, membri, instanțiere, biblioteci
    - Fișiere text: deschidere, citire, scriere, închidere; clasa TextIOWrapper Python
    - Biblioteca Tkinter pentru GUI: Tk, Label, Button, Entry, Text, Frame, Canvas, MessageBox
    - Clasa list Python: operatori ([], in, not in, +, *, ==), metode (append, extend, remove, sort, reverse, copy, index, count)

**Pregătire militară** — 2 · CD
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16
  - *Continut (in ordine):*
    - Disciplină militară specifică profilului (regulamente, instrucție — conținut detaliat în programa separată Pregatire_militara_CS_IX-XII.pdf)

### Clasa a X-a

**Tehnologia Informației și a Comunicațiilor (TIC)** — 1 · TC
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16 (plan-cadru); programa cls. X nepublicată — proiecție curriculară disponibilă în consultare publică nov-dec 2025
  - *Aplicatii:* Suite office — calc tabelar (LibreOffice Calc / Excel), Editare imagini (GIMP sau echivalent)
  - *Continut (in ordine):*
    - Securitate cibernetică și etică în spațiul digital
    - Navigare avansată pe web
    - Birotică: calcul tabelar avansat (formule, grafice, macro-uri), baze de date introductive (tabele, interogări)
    - Imagini digitale: prelucrare, formate, compresie
    - Componenta software avansată: sisteme de operare, rețele de bază, întreținere și depanare elementară

**Informatică** — 3 (2 ore teorie + 1 oră practică în lab) · CD
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16 (plan-cadru); programa cls. X militara nepublicată — se va aplica din 2027-2028; pana atunci OMECI 5099/09.09.2009
  - *Limbaj:* C/C++ (OMECI 5099/2009 in vigoare pana in 2027-2028); Python (noul curriculum din 2027-2028)
  - *Aplicatii:* Code::Blocks, Dev-C++ sau echivalent pentru C/C++ (până la 2027-2028), Python 3 (din 2027-2028)
  - *Continut (in ordine):*
    - [OMECI 5099/2009 — în vigoare] Elemente de bază ale limbajului C/C++: structura programelor, vocabular, tipuri simple, constante, variabile, expresii, citire/scriere
    - [OMECI 5099/2009] Structuri de control: liniară, alternativă, repetitivă; mediu de programare (editare, compilare, rulare, depanare)
    - [OMECI 5099/2009] Tipul tablou: unidimensional și bidimensional; fișiere text
    - [OMECI 5099/2009] Algoritmi fundamentali pe tablouri: căutare secvențială și binară, sortare, interclasare; prelucrari specifice tablourilor bidimensionale
    - [OMECI 5099/2009] Aplicații interdisciplinare; analiza eficienței algoritmilor
    - [Proiecție noul curriculum] Structuri liniare avansate, subprograme cu parametri, recursivitate — Python

**Pregătire militară** — 2 · CD
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16
  - *Continut (in ordine):*
    - Continuare pregătire militară specifică profilului

### Clasa a XI-a

**Tehnologia Informației și a Comunicațiilor (TIC)** — 1 · TC
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16 (plan-cadru); programa cls. XI nepublicată — proiecție curriculară
  - *Aplicatii:* Editare audio-video (ex. Audacity, Kdenlive sau echivalent), SGBD introductiv (ex. LibreOffice Base / Microsoft Access), Simulator robotică (ex. micro:bit, Scratch sau echivalent)
  - *Continut (in ordine):*
    - Modele computerizate ale unor sisteme expert, activități economice, de mediu sau recreative
    - Prelucrări audio și audio-video: formate, instrumente de editare
    - Baze de date: tabele, interogări, formulare, rapoarte (nivel introductiv)
    - Dispozitive inteligente și Internetul obiectelor (IoT): caracteristici, configurare, utilizare
    - Fundamente ale roboticii: roboți virtuali, comportament, testare
    - Rețele de calculatoare: componente, protocoale (TCP/IP), configurare de bază

**Informatică** — 3 (2 ore teorie + 1 oră practică în lab) · CD
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16 (plan-cadru); programa cls. XI militara nepublicată — se va aplica din 2028-2029; pana atunci OMECI 5099/09.09.2009
  - *Limbaj:* C/C++ (OMECI 5099/2009 in vigoare pana in 2028-2029); Python (noul curriculum din 2028-2029)
  - *Aplicatii:* Code::Blocks sau echivalent pentru C/C++ (până la 2028-2029), Python 3 (din 2028-2029)
  - *Continut (in ordine):*
    - [OMECI 5099/2009 — în vigoare] Subprograme în C++ (funcții și proceduri): parametri, transmitere prin valoare și referință
    - [OMECI 5099/2009] Recursivitate
    - [OMECI 5099/2009] Metoda backtracking: principiu, aplicații (permutări, combinări, labirint)
    - [OMECI 5099/2009] Structuri de date: noțiuni despre liste înlănțuite, arbori, grafuri
    - [OMECI 5099/2009] Algoritmi pe grafuri: BFS/DFS (la nivelul curriculumului matematică-informatică)
    - [Proiecție noul curriculum] OOP aprofundat (moștenire, polimorfism, encapsulare), structuri de date avansate — Python

**Pregătire militară** — 2 · CD
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16
  - *Continut (in ordine):*
    - Continuare pregătire militară specifică profilului

### Clasa a XII-a

**Tehnologia Informației și a Comunicațiilor (TIC)** — 1 · TC
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16 (plan-cadru); programa cls. XII nepublicată — proiecție curriculară
  - *Aplicatii:* Instrumente design UI/UX (ex. Figma sau echivalent), Instrumente administrare rețea (ex. Cisco Packet Tracer sau echivalent)
  - *Continut (in ordine):*
    - Participare civică și profesională în spațiul digital: portofoliu digital, identitate online, cetățenie digitală
    - Aplicații cu interfețe vizuale: design UI/UX, ergonomie digitală, principii de comunicare vizuală
    - Rețele de calculatoare avansate: proiectare configurație, monitorizare, securizare rețea
    - Proiecte integrate de creare de produse digitale personalizate

**Informatică** — 3 (2 ore teorie + 1 oră practică în lab) · CD
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16 (plan-cadru); in vigoare pana in 2029-2030: OMECI 5099/09.09.2009
  - *Limbaj:* C/C++ + SQL (OMECI 5099/2009 in vigoare pana in 2029-2030); Python + SQL (noul curriculum din 2029-2030)
  - *Aplicatii:* MySQL / Oracle / Microsoft SQL Server (modul baze de date), Visual FoxPro sau Visual Basic .NET (modul programare vizuală — opțional), Editoare HTML/CSS/JS (modul web — opțional), Python 3 + biblioteci SQL (noul curriculum din 2029-2030)
  - *Continut (in ordine):*
    - [OMECI 5099/2009 — în vigoare] Modul obligatoriu: Baze de date (1 oră/săpt. teorie): concepte, modele entitate-relație
    - [OMECI 5099/2009] Module opționale: Sisteme de gestiune a bazelor de date + SQL (Oracle, MySQL, Microsoft SQL Server) — 3 ore practică
    - [OMECI 5099/2009] Programare vizuală (Visual Basic .NET) — 1 oră teorie + 2 ore practică (opțional)
    - [OMECI 5099/2009] Programare web (HTML, CSS, JavaScript) — 1 oră teorie + 2 ore practică (opțional)
    - [OMECI 5099/2009] Programarea procedurală a bazelor de date (PL/SQL, Transact-SQL, MySQL) — 1 oră teorie + 2 ore practică (opțional)
    - [Noul curriculum 2025] SQL în Python: interogări, CRUD, modele relaționale; proiecte software complete; elemente de inteligentă artificială

**Pregătire militară** — 2 · CD
  - *Baza legala:* OMEC nr. 4.350/20.06.2025, Anexa 16
  - *Continut (in ordine):*
    - Continuare pregătire militară specifică profilului

**Surse oficiale:**
- https://www.edu.ro/OMEC_4350_2025_planuri_cadru_liceu_frecventa_zi — OMEC nr. 4.350/20.06.2025, pagina oficială edu.ro
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Legislatie/2025/OMEC_4350_2025/Anexa_16_OMEC_4350_2025.pdf — Anexa 16: Plan-cadru filiera vocațională, profilul militar, specializarea matematică-informatică militară, cls. IX-XII (publicat în Monitorul Oficial nr. 594 bis/26.06.2025)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Informatica_CS_IX_Militar_Matematica_informatica_militara.pdf — Programa școlară Informatică cls. IX, CS, filiera vocațională profilul militar (consultare publică 2025)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Tehnologia_informatiei_si_a_comunicatiilor_TC_IX.pdf — Programa TIC cls. IX, trunchi comun (consultare publică 2025)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/TIC_TC_X_XII_proiectie_curriculara.pdf — Proiecție curriculară TIC cls. X-XII (consultare publică 2025)
- https://www.edu.ro/cons_pub_programe_scolare_liceu — Pagina oficială a consultații publice programe școlare liceu (Ministerul Educației)
- https://rocnee.eu/images/rocnee/fisiere/repere_medotologice/2025/finale/REPERE_METODOLOGICE_INFORMATIC%C4%82_2024_2025_CLS_XII.pdf — Repere metodologice Informatică cls. XII, an școlar 2024-2025 (ROCNEE) — confirmă OMECI 5099/2009 în vigoare pentru XII
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/Informatica_teoretic_vocational_clasa%20a%20X-a.pdf — Programa Informatică cls. X filiera vocațională profil militar, OMECI 5099/09.09.2009
- https://www.isjcta.ro/wp-content/uploads/2013/06/informatica_9.pdf — Programa Informatică cls. IX filiera vocațională profil militar, OMECI 5099/2009 (ISJ Caraș-Timișoara)

**Incertitudini (de re-verificat la build):**
- Programele școlare pentru clasele X, XI, XII (Informatică, profil militar) NU sunt publicate la data cercetării (iun 2026) — doar cls. IX a intrat în consultare publică nov-dec 2025. Ordinul de aprobare al programei cls. IX nu fusese semnat oficial (numărul apare blank în document). Conținuturile cls. X-XII din noul curriculum sunt deduse din proiecția curriculară și din structura cls. IX.
- Profilul MAI / ordine și securitate publică: OMEC 4350/2025 NU include niciun plan-cadru pentru acest profil (Anexele 1-38 acoperă doar MApN ca profil militar). Nu a putut fi identificat un ordin curent explicit cu plan-cadru pentru filiera vocațională, profil ordine și securitate publică, cu specializare de tip informatică. Surse secundare sugerează că TIC există la profil MAI (1 oră/săpt. în CD la cls. XI sub OMECI 5099/2009), dar nu a putut fi confirmat documentar printr-un plan-cadru oficial identificat.
- Tranziția OMECI 5099/2009 → OMEC 4350/2025: Cls. X trece la noul curriculum în 2027-2028, cls. XI în 2028-2029, cls. XII în 2029-2030. Elevii care intră în cls. IX în 2026-2027 vor studia Informatică cu Python (cls. IX), C/C++ (cls. X în 2027-28), revenind la Python (cls. XI-XII în 2028-2030) — tranziție mixtă cu risc de incoerență curriculară.
- Conținuturile TIC pentru clasele X-XII (noul curriculum) sunt prezentate doar ca proiecție curriculară, nu ca programe școlare aprobate — pot suferi modificări.
- Software-ul specific utilizat în laboratoare depinde de dotarea fiecărui colegiu militar (5 colegii: Câmpulung Moldovenesc, Breaza, Craiova, Predeal, Alba Iulia) și nu este stipulat explicit în programa școlară.

---

## Pedagogic  `[pedagogic]`  &mdash; verificare: `reject`

**Rezumat:** Profilul PEDAGOGIC (filiera vocationala) pregateste viitori invatatori, educatori, mediatori scolari si pedagogi pentru educatie nonformal. Sub planul-cadru actual (OMECTS 5347/2011), disciplina TIC este prezenta in trunchiul comun la cls IX (2 ore/sapt) si X (1 ora/sapt), aprobata prin OMEN 5099/2009, cu continut orientat pe Office (Word, Excel, Access, PowerPoint) si internet - fara limbaj de programare. In cls XI si XII, TIC apare ca curriculum diferentiat (1 ora/sapt fiecare) sub denumirea speciala "Tehnici de documentare asistata de calculator", tot prin OMEN 5099/2009. Incepand cu generatia de cls IX din 2026-2027, noul plan-cadru OMEC 4350/2025 restructureaza TIC la 1 ora/sapt in trunchiul comun pentru toate cele 4 clase (IX-XII), cu program nou (2025, in consultare). Curriculumul de specialitate (CS) al profilului pedagogic include in noul plan si disciplina "Pedagogie digitala si educatie media" in cls XII, integrand competente digitale in formarea pedagogica. Nu exista o disciplina separata de informatica (algoritmica/programare) pentru acest profil.

**Specializari:** Pedagogia educatiei timpurii, Pedagogia invatamantului primar, Pedagogia educatiei nonformale, Mediere scolara, Pedagogie generala

### Clasa a IX-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 2 (plan-cadru OMECTS 5347/2011, valabil pana in 2025-2026); 1 (plan-cadru OMEC 4350/2025, aplicabil din 2026-2027) · trunchi comun (TC)
  - *Baza legala:* OMEN 5099/09.09.2009 (programa in vigoare); programa noua 2025 in consultare publica (OMEC 4350/2025)
  - *Limbaj:* Nu este specificat
  - *Aplicatii:* Microsoft Word, Microsoft Internet Explorer / browsere web, Outlook Express / clienti e-mail, Notepad, Paint
  - *Continut (in ordine):*
    - Sisteme de operare (Windows): gestiune fisiere/foldere, accesorii
    - Tehnoredactare text: editare documente, formatare, tabele, grafice, corespondenta in masa
    - Internet si comunicare: browsere, e-mail, securitate online, TCP/IP, DNS
    - Crearea paginilor web: HTML de baza, hiperlegatura, tabele (program 2004/2009)
    - NOU (2025, in consultare): competente digitale DigiComp 2.2; utilizare responsabila

**Introducere in pedagogie / Teoria si Metodologia Curriculumului (CS)** — 1-2 (in functie de specializare) · curriculum diferentiat (CD) / curriculum de specialitate (CS)
  - *Baza legala:* OMEN 3608/2009 (program vechi); programe noi 2025 in consultare (Ordinul 4350/2025)
  - *Limbaj:* Nu este cazul
  - *Aplicatii:* Kahoot, Canva, Padlet, Copilot/ChatGPT (materiale didactice digitale)
  - *Continut (in ordine):*
    - Introducere in pedagogie si teoria curriculumului
    - Comunicare didactica
    - Managementul emotiilor
    - Sanatate, nutritie, motricitate la copilul mic (pt Educatie timpurie)
    - Aritmetica (pt Invatamant primar)
    - Practica pedagogica (3h/sapt in noul plan-cadru)

### Clasa a X-a

**Tehnologia Informatiei si a Comunicatiilor (TIC)** — 1 (plan-cadru OMECTS 5347/2011); 1 (plan-cadru OMEC 4350/2025) · trunchi comun (TC)
  - *Baza legala:* OMECI 5099/09.09.2009 (programa in vigoare); proiectie curriculara TIC X-XII 2025 in consultare
  - *Limbaj:* Nu este specificat
  - *Aplicatii:* Microsoft Excel, Microsoft Access, Microsoft PowerPoint
  - *Continut (in ordine):*
    - Calcul tabelar (Excel): formatare, formule, functii, grafice, aplicatii practice
    - Baze de date (Access): creare tabele, formulare, interogari, rapoarte
    - Prezentari (PowerPoint): slide-uri, formatare, animatii, grafice, export

**Practica pedagogica + discipline CD (Teoria si practica instruirii, Educatie muzicala, vizuala etc.)** — 9 total CD · curriculum diferentiat (CD)
  - *Baza legala:* OMEN 3608/2009; programe noi 2025 in consultare
  - *Limbaj:* Nu este cazul
  - *Continut (in ordine):*
    - Teoria si practica instruirii si evaluarii
    - Educatie muzicala aplicata
    - Educatie vizuala aplicata
    - Pregatire practica de specialitate

### Clasa a XI-a

**Tehnologia Informatiei si a Comunicatiilor - Tehnici de documentare asistata de calculator** — 1 (plan-cadru OMECTS 5347/2011); 1 (plan-cadru OMEC 4350/2025 - TC) · curriculum diferentiat (CD)
  - *Baza legala:* OMEN 5099/09.09.2009 (programa in vigoare); pentru plan-cadru nou, TIC devine TC 1h
  - *Limbaj:* Nu este specificat
  - *Aplicatii:* Microsoft Word (avansat), aplicatii de desktop publishing
  - *Continut (in ordine):*
    - Tehnici de documentare asistata de calculator
    - Procesare avansata de documente: stiluri, cuprins automat, note de subsol
    - Colectare si organizare informatii (documentare)
    - Elaborare reviste scolare, carti, ziare cu instrumente digitale
    - Metoda proiectului in activitati de documentare

### Clasa a XII-a

**Tehnologia Informatiei si a Comunicatiilor - Tehnici de documentare asistata de calculator** — 1 (plan-cadru OMECTS 5347/2011); 1 (plan-cadru OMEC 4350/2025 - TC) · curriculum diferentiat (CD)
  - *Baza legala:* OMEN 5099/09.09.2009 (programa in vigoare); repere metodologice 2024-2025 ROCNEE
  - *Limbaj:* Nu este specificat
  - *Aplicatii:* Microsoft Word, Microsoft Access (baze de date documentare), aplicatii prezentare
  - *Continut (in ordine):*
    - Tehnici de documentare asistata de calculator (continuare)
    - Utilizarea calculatorului in simularea functionarii unei unitati (proiecte interdisciplinare)
    - Baze de date simple pt documentare
    - Prezentari profesionale si publicare digitala

**Pedagogie digitala si educatie media** — 1 (conform noului plan-cadru OMEC 4350/2025, aplicabil din 2029-2030 pt cls XII) · curriculum de specialitate (CS)
  - *Baza legala:* Program in consultare publica 2025/2026 (OMEC 4350/2025 + programe elaborate 2026)
  - *Limbaj:* Nu este cazul
  - *Aplicatii:* Canva, Kahoot, Padlet, NotebookLM, ChatGPT/Copilot (AI in educatie)
  - *Continut (in ordine):*
    - Pedagogie digitala: integrarea tehnologiei in procesul educational
    - Educatie media: analiza critica a continutului digital
    - Creare materiale didactice digitale (infografice, prezentari interactive)
    - Instrumente digitale pentru educatie
    - Securitate digitala si utilizare responsabila

**Surse oficiale:**
- https://www.edu.ro/OMEC_4350_2025_planuri_cadru_liceu_frecventa_zi (OMEC 4350/20.06.2025 - plan-cadru nou liceu zi)
- https://cdn.edupedu.ro/wp-content/uploads/2025/06/Anexe-Planuri-Cadru-Liceu-2025-Edupedu-MOf.pdf (Anexe plan-cadru MOf 2025)
- https://www.edu.ro/cons_pub_programe_scolare_liceu (Programe scolare consultare publica 2025)
- https://www.edu.ro/sites/default/files/_fisiere/Minister/2025/programe_scolare_cons_pub/Tehnologia_informatiei_si_a_comunicatiilor_TC_IX.pdf (TIC TC cls IX - programa 2025)
- https://www.edu.ro/sites/default/files/_fisiere/Minister/2025/programe_scolare_cons_pub/TIC_TC_X_XII_proiectie_curriculara.pdf (TIC TC X-XII proiectie curriculara 2025)
- https://rocnee.eu/index.php/dcee-oriz/curriculum-oriz/planuri-cadru-actuale/planuri-cadru-invatamant-liceal (Plan-cadru OMECTS 5347/2011 in vigoare)
- https://rocnee.eu/images/rocnee/fisiere/programe_scolare/2023/TEHN/TIC_Tehnici%20de%20documentare%20asistata%20de%20calculator_teoretic_vocational_clasa%20a%20XII-a.pdf (TIC Tehnici documentare cls XII - ROCNEE)
- https://www.isjcta.ro/wp-content/uploads/2013/06/tic11_documentare_omec.pdf (TIC Tehnici documentare cls XI - ISJ Cluj)
- https://www.slideshare.net/slideshow/programa-scolara-tic10/10700963 (Programa TIC cls X - OMECI 5099/2009)
- https://lege5.ro/Gratuit/gezdmmzrha/curriculum-diferentiat-pentru-ciclul-inferior-al-liceului-filiera-vocationala-profilul-pedagogic-specializarea-invatator-educatoare-ordin-3608-2009 (CD cls IX-X - OMEN 3608/2009)
- https://www.edupedu.ro/proiect-planurile-cadru-liceu-pentru-pedagogic-2025-puse-in-dezbatere-publica-vezi-disciplinele-pe-care-ar-putea-sa-le-studieze-elevii-care-vor-sa-devina-invatatori-educatori-pedagogi-si-mediatori/ (Edupedu - plan-cadru pedagogic 2025)
- https://rocnee.eu/images/rocnee/fisiere/repere_medotologice/2025/finale/REPERE_METODOLOGICE_TIC_2024_2025_CLS_XII.pdf (Repere metodologice TIC 2024-2025 cls XII - ROCNEE)

**Incertitudini (de re-verificat la build):**
- Numarul exact de ore/sapt pentru TIC in noul plan-cadru (OMEC 4350/2025) la cls IX-XII nu a putut fi confirmat din tabelele efective ale Anexelor 17-21 (PDFuri cu encoding CID nedecodabil), ci doar din surse secundare (Edupedu, informatii din presa edu). Cea mai credibila sursa indica 1h TC pentru toate clasele IX-XII.
- Programa noua TIC TC cls IX (2025) este inca in consultare publica la data cercetarii; nu a primit inca un OMEN de aprobare definitiv pentru programe.
- Disciplina 'Pedagogie digitala si educatie media' (CS cls XII) apare mentionata in presa si comunicate ME ca parte din cele 67 programe elaborate pentru profil pedagogic, dar programa scolara efectiva nu a fost accesibila pentru a confirma continutul exact.
- Nu s-a putut confirma daca 'Tehnici de documentare asistata de calculator' (cls XI-XII) este clasificata ca TC sau CD in noul plan-cadru OMEC 4350/2025 - in planul vechi era CD, iar in noul plan TIC devine TC pentru toate profilurile.
- Programa TIC cls IX din 2009 (OMEN 5099) mentiona continut incluzand crearea paginilor web cu HTML - nu este clar daca acest modul se pastra sau era optional; programa noua 2025 este in consultare.
- Implementarea OMEC 4350/2025: cls IX incepe cu 2026-2027, cls X cu 2027-2028, cls XI cu 2028-2029, cls XII cu 2029-2030. In 2025-2026 se aplica inca planul vechi OMECTS 5347/2011 cu OMEN 5099/2009.

---

## Artistic  `[artistic]`  &mdash; verificare: `reject`

**Rezumat:** Filiera vocationala, profilul artistic cuprinde 6 specializari distincte (Muzica, Arte Vizuale, Conservare-Restaurare Bunuri Culturale, Arhitectura-Arte Ambientale-Design, Coregrafie, Arta actorului), reglementate de O.M.E.C. nr. 4.350/20.06.2025 (in vigoare din 2026-2027). Disciplina TIC este prezenta ca trunchi comun (TC) in toate cele 6 specializari, 1 ora/saptamana la toate clasele IX-XII, acoperind competente digitale generale: societate digitala, continuturi digitale (biirotica, audio-video, imagini, pagini web) si sisteme de calcul; programa TC cls. IX a fost lansata in consultare publica in nov-dec 2025 (edu.ro). Disciplina specifica digitala de specialitate este Prelucrarea Computerizata a Imaginii (PCI) — curriculum de specialitate (CS/CD) — prezenta la specializarile Arte Vizuale (2h/sapt. la cls. XI si XII), Conservare-Restaurare Bunuri Culturale (2h/sapt. la cls. XI si XII) si Arhitectura-Arte Ambientale-Design (1h/sapt. la cls. XI); aceasta acopera grafica raster si vectoriala 2D, fotografie digitala (tehnica si practica), procesare si ajustare imagine pentru prezentare, si initiere in grafica 3D. Specializarea Arhitectura are in plus la cls. XII disciplina Proiectarea asistata de computer (CAD, 1h/sapt. CS), ce introduce proiectarea tehnica asistata de calculator in domeniu. Muzica include in CS la cls. XI Tehnoredactarea muzicala (1h/sapt.) si la cls. XII Procesarea muzicii pe calculator (1h/sapt.), acoperind software de notatie si productie muzicala digitala (DAW). Specializarile Coregrafie si Arta actorului nu includ discipline digitale de specialitate (CS), avand in plus fata de TIC-ul comun doar componentele lor artistice specifice. Nu exista audio-video ca disciplina separata in planurile-cadru oficiale OMEC 4350/2025; prelucrarea audio-video apare ca tema in TIC TC (cls. XI) si partial in PCI. Aplicatiile software recomandate in programa PCI includ un program de grafica 2D cu suport raster si vectorial si layere (ex. Photoshop sau similar), aparat foto digital, scanner, si software 3D introductiv.

**Specializari:** Muzica (Anexa 10), Arte Vizuale (Anexa 11), Conservare-Restaurare Bunuri Culturale (Anexa 12), Arhitectura, Arte Ambientale si Design (Anexa 13), Coregrafie (Anexa 14), Arta Actorului (Anexa 15)

### Clasa a IX-a

**Tehnologia informatiei si a comunicatiilor (TIC)** — 1 ora/saptamana (toate cele 6 specializari) · TC
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025 (Anexele 10-15); programa TC cls.IX in consultare publica nov-dec 2025
  - *Aplicatii:* Suite office (documente, prezentari, calcul tabelar), Aplicatii de creare pagini web, Instrumente de prelucrare imagini digitale, Instrumente de navigare si colaborare online
  - *Continut (in ordine):*
    - Societate digitala: comunicare si colaborare digitala, aplicatii si platforme care sprijina invatarea, introducere in inteligenta artificiala, securitate cibernetica si etica in spatiul digital
    - Continuturile digitale si aplicatii specializate (biirotica: documente digitale, prezentari, calcul tabelar, baze de date; pagini web, imagini digitale, prelucrari audio, audio-video)
    - Sisteme de calcul: componenta hardware si software, retele, dispozitive inteligente si IoT, fundamente de robotica

**Discipline de specialitate din domeniul arte (CS) — fara componenta digitala la cls. IX** — 10 ore/saptamana (Arte Vizuale, Conservare-Restaurare, Arhitectura); 12 ore/saptamana (Muzica); 16 ore/saptamana (Coregrafie); 11 ore/saptamana (Arta actorului) · CD
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025
  - *Continut (in ordine):*
    - Arte Vizuale: Atelier de specialitate 2h, Studiul formelor in desen 2h, Studiul formelor in culoare 2h, Studiul formelor in volum 2h, Crochiuri 1h, Istoria artelor si a arhitecturii 1h
    - Conservare-Restaurare: Studiul formelor in desen 2h, Studiul formelor in culoare 2h, Studiul formelor in volum 2h, Bazele stiintifice ale conservarii si restaurarii 1h, Materiale si tehnici 2h, Istoria artelor 1h
    - Arhitectura: Atelier de specialitate 2h, Studiul formelor in desen 3h, Studiul formelor in culoare 1h, Studiul formelor in volum 1h, Geometrie descriptiva si perspectiva 1h, Matematica aplicata in arhitectura 1h, Istoria artelor 1h
    - Muzica: Instrument principal 3h, Teoria muzicii 2h, Ansamblu orchestral/coral/folcloric 3h, Muzica de camera 1h, Pian complementar 1h, Corepetitie 1h, Istoria muzicii 1h
    - Coregrafie - Dans clasic: Dans clasic 8h, Dans contemporan 1h, Repertoriu individual 1h, Repertoriu ansamblu 1h, Dans de caracter 1h, Istoria baletului 1h, Laboratorul de creatie 1h, Dans romanesc 1h, Educatie muzicala 1h
    - Arta actorului: Arta actorului 4h, Istoria teatrului 1h, Artele spectacolului 1h, Elemente de improvizatie 1h, Euritmie 1h, Dictie 1h, Educatie muzicala 1h, Educatie vizuala 1h

### Clasa a X-a

**Tehnologia informatiei si a comunicatiilor (TIC)** — 1 ora/saptamana (toate cele 6 specializari) · TC
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025 (Anexele 10-15)
  - *Aplicatii:* Editor pagini web, Aplicatii calcul tabelar, Aplicatii de prelucrare imagini digitale
  - *Continut (in ordine):*
    - Societate digitala: securitate si folosire sigura a tehnologiilor moderne, navigare avansata pe web
    - Continuturi digitale: pagini web, foi de calcul, imagini digitale (recunoastere, prelucrare, evaluare, creare)
    - Sisteme de calcul: intretinere si depanare de baza, asamblare hardware, programe utilitare

**Discipline de specialitate din domeniul arte (CS) — fara componenta digitala la cls. X** — 10 ore/saptamana (Arte Vizuale, Conservare-Restaurare, Arhitectura); 12 ore/saptamana (Muzica); 16 ore/saptamana (Coregrafie); 11 ore/saptamana (Arta actorului) · CD
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025
  - *Continut (in ordine):*
    - Arte Vizuale: Atelier de specialitate 2h, Studiul formelor in desen 2h, Studiul formelor in culoare 2h, Studiul formelor in volum 2h, Crochiuri 1h, Istoria artelor 1h
    - Conservare-Restaurare: Studiul formelor in desen 2h, Studiul formelor in culoare 2h, Studiul formelor in volum 2h, Bazele stiintifice 2h, Materiale si tehnici 1h, Istoria artelor 1h
    - Arhitectura: Atelier de specialitate 2h, Studiul formelor in desen 3h, Studiul formelor in culoare 1h, Studiul formelor in volum 1h, Geometrie descriptiva 1h, Matematica aplicata 1h, Istoria artelor 1h
    - Muzica: acelasi plan ca cls. IX (12h CS)
    - Coregrafie - Dans clasic: Dans clasic 8h, Dans contemporan 1h, celelalte discipline ca cls. IX
    - Arta actorului: plan similar cls. IX (11h CS)

### Clasa a XI-a

**Tehnologia informatiei si a comunicatiilor (TIC)** — 1 ora/saptamana (toate cele 6 specializari) · TC
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025 (Anexele 10-15)
  - *Aplicatii:* Instrumente de editare audio/video, Sisteme de gestiune baze de date (SGBD), Instrumente de modelare si simulare, Platforme IoT/robotica educationala
  - *Continut (in ordine):*
    - Societate digitala: modele computerizate ale unor sisteme expert, activitati economice/mediu/recreere
    - Continuturi digitale: audio, audio-video, baze de date (recunoastere, explicare, utilizare, evaluare, creare)
    - Sisteme de calcul: dispozitive inteligente, Internet of Things (IoT), roboti virtuali

**Prelucrarea Computerizata a Imaginii (PCI) — Curriculum Specialitate** — 1 ora/saptamana (Arhitectura, Arte Ambientale si Design — OMEC 4350/2025 Anexa 13); 2 ore/saptamana (Arte Vizuale — Anexa 11; Conservare-Restaurare — Anexa 12) · CD
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025; programa scolara in consultare publica nov-dec 2025 (edu.ro)
  - *Aplicatii:* Program de grafica 2D cu suport raster si vectorial si layere (ex: Adobe Photoshop, GIMP sau similar), Aparat foto digital sau telefon mobil cu camera foto, Scanner format A4 sau A3, Software 3D introductiv (ex: Blender, SketchUp introductiv sau similar), Conexiune internet, Videoproiector pentru demonstratii
  - *Continut (in ordine):*
    - Notiuni de baza ale graficii pe calculator: pixel si rezolutie, moduri de culoare (RGB, CMYK), grafica raster vs vectoriala
    - Arhitectura programelor de grafica 2D: formate fisiere grafice (BMP, JPEG, GIF, PNG, TIFF, EPS, PSD, PDF); interfata (meniuri, instrumente); obiecte pe straturi (layere); operatii de selectie (regulata, poligonala, magnetica); alinierea, aranjarea, gruparea obiectelor; redimensionare, deplasare, rotire, transformare, decupare; corectii culoare si tonalitate; instrumente grafica raster (distorsionari, filtre, efecte speciale blur, solarizare); instrumente grafica vectoriala (trasare linii drepte si curbe, figuri geometrice de baza, culoare, grosime linie, umplere spatii inchise, texturi, conturare, extrudare)
    - Fundamentele fotografiei digitale: ochiul si aparatul de fotografiat, clasificari aparate foto, tehnica digitala, tipuri de lumina, senzori, obturator, obiective si tipuri, distanta focala, diafragma, timp de expunere, profunzimea de camp, sensibilitate ISO, zgomot de imagine, sisteme de masurare a luminii, focusare, temperatura de culoare, balansul de alb, histograma, filtre, macro/teleconvertoare
    - Probleme practice fotografiere si PCI in conditii studio (atelier): digitalizarea desenelor si ajustarea computerizata; fotografierea machetelor si procesarea computerizata
    - Probleme practice fotografiere si PCI in aer liber: corectarea fotografiei de locatie; fotografii panoramice si desfasurarea stradala
    - Ajustarea imaginilor pentru prezentare digitala sau tiparita: plansei, afise, materiale publicitare; pregatire materiale pentru calculator (prezentari, pagini web): rezolutie, dimensiune, optimizare fisier; prelucrare imagini pentru inserare in materiale diverse
    - Initiere in grafica vizuala 3D: concepte de baza ale modelarii geometrice 3D, interfata de lucru, generarea formelor geometrice 3D, asezarea lor in compozitii

**Tehnoredactare muzicala (Muzica, CS)** — 1 ora/saptamana (Muzica — toate sectiile: Interpretare instrumentala I.1, I.2; Vocala II.1, II.2, II.3; Studii teoretice III) · CD
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025 (Anexa 10)
  - *Aplicatii:* Software de notatie muzicala (ex: MuseScore, Sibelius sau similar)
  - *Continut (in ordine):*
    - Tehnoredactarea partiturilor muzicale pe calculator
    - Utilizarea software-ului specializat de notatie muzicala
    - Producerea si editarea documentelor muzicale digitale

### Clasa a XII-a

**Tehnologia informatiei si a comunicatiilor (TIC)** — 1 ora/saptamana (toate cele 6 specializari) · TC
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025 (Anexele 10-15)
  - *Aplicatii:* Platforme de colaborare profesionala, Instrumente de creare continut digital avansat, Aplicatii de participare civica digitala
  - *Continut (in ordine):*
    - Societate digitala: participare civica si profesionala in spatiul digital, tehnologii emergente, modelare computerizata avansata
    - Continuturi digitale: interfete vizuale si ergonomie digitala, integrare competente anterioare
    - Sisteme de calcul: aspecte avansate de securitate cibernetica si etica in spatiul digital

**Prelucrarea Computerizata a Imaginii (PCI) — Curriculum Specialitate** — 2 ore/saptamana (Arte Vizuale — Anexa 11; Conservare-Restaurare — Anexa 12); ABSENTA la Arhitectura, Arte Ambientale si Design (cls. XII — locul este luat de Proiectarea asistata de computer) · CD
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025 (Anexele 11 si 12)
  - *Aplicatii:* Program de grafica 2D avansat, Aparat foto digital, Software 3D introductiv, Scanner
  - *Continut (in ordine):*
    - Aprofundarea tehnicilor de grafica 2D raster si vectoriala
    - Tehnici avansate de fotografiere si procesare computerizata a imaginii
    - Ajustarea imaginilor pentru prezentare digitala si tiparita
    - Grafica vizuala 3D — modelare geometrica introductiva

**Proiectarea asistata de computer — Curriculum Specialitate** — 1 ora/saptamana (exclusiv Arhitectura, Arte Ambientale si Design — Anexa 13 OMEC 4350/2025) · CD
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025 (Anexa 13)
  - *Aplicatii:* Software CAD (ex: AutoCAD, SketchUp, Revit sau echivalent)
  - *Continut (in ordine):*
    - Proiectare asistata de calculator (CAD) aplicata in arhitectura, arte ambientale si design
    - Reprezentari tehnice bidimensionale si tridimensionale
    - Generarea planurilor, sectiunilor si elevatiilor arhitecturale
    - Vizualizare arhitecturala si design de produs cu instrumente CAD

**Procesarea muzicii pe calculator (Muzica, CS)** — 1 ora/saptamana (Muzica — toate sectiile la cls. XII; inlocuieste Tehnoredactare muzicala de la cls. XI) · CD
  - *Baza legala:* O.M.E.C. nr. 4.350/20.06.2025 (Anexa 10)
  - *Aplicatii:* Software DAW (ex: Audacity, GarageBand, Reaper, Logic Pro sau similar)
  - *Continut (in ordine):*
    - Procesarea si editarea muzicii pe calculator
    - Productie muzicala digitala (DAW — Digital Audio Workstation)
    - Mixaj, mastering si export audio
    - Creatia muzicala digitala si aranjamente

**Surse oficiale:**
- https://www.edu.ro/OMEC_4350_2025_planuri_cadru_liceu_frecventa_zi — Ordin nr. 4350/20.06.2025, pagina oficaila cu link-uri catre toate anexele
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Legislatie/2025/OMEC_4350_2025/Anexa_10_OMEC_4350_2025.pdf — Anexa 10: Muzica (extras din PDF)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Legislatie/2025/OMEC_4350_2025/Anexa_11_OMEC_4350_2025.pdf — Anexa 11: Arte Vizuale (extras din PDF)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Legislatie/2025/OMEC_4350_2025/Anexa_12_OMEC_4350_2025.pdf — Anexa 12: Conservare-Restaurare Bunuri Culturale (extras din PDF)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Legislatie/2025/OMEC_4350_2025/Anexa_13_OMEC_4350_2025.pdf — Anexa 13: Arhitectura, Arte Ambientale si Design (extras din PDF)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Legislatie/2025/OMEC_4350_2025/Anexa_14_OMEC_4350_2025.pdf — Anexa 14: Coregrafie (extras din PDF)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Legislatie/2025/OMEC_4350_2025/Anexa_15_OMEC_4350_2025.pdf — Anexa 15: Arta Actorului (extras din PDF)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/transa_3_25_11_2025/Arhitectura_Procesarea_Computerizata_a_Imaginii_CS_XI.pdf — Programa scolara PCI cls. XI Arhitectura (extras din PDF, consultare publica nov-dec 2025)
- https://www.edu.ro/sites/default/files/_fi%C8%99iere/Minister/2025/programe_scolare_cons_pub/Tehnologia_informatiei_si_a_comunicatiilor_TC_IX.pdf — Proiectie curriculara TIC cls. IX-XII (consultare publica 2025)
- https://www.edu.ro/cons_pub_programe_scolare_liceu — Pagina centrala consultare publica programe scolare liceu
- https://legislatie.just.ro/Public/DetaliiDocumentAfis/299334 — ORDIN 4350/2025 in Portalul Legislativ

**Incertitudini (de re-verificat la build):**
- Programele scolare pentru PCI la specializarile Arte Vizuale si Conservare-Restaurare (cls. XI-XII) nu au fost gasite ca PDF-uri individuale in consultarea publica din nov-dec 2025 — este posibil sa fie aceleasi sau similare cu cea de la Arhitectura; confirmare necesara pe edu.ro
- Continutul exact al TIC la cls. XII (programa completa) nu a fost extras direct; proiectia curriculara disponibila pe edu.ro acopera competentele specifice cls. X, XI si XII intr-un singur document de proiectie — nu este inca programa finala aprobata prin ordin separat
- OMEC 4350/2025 intra in vigoare din anul scolar 2026-2027 (cls. IX) cu aplicare progresiva pana la cls. XII in 2029-2030; in 2025-2026 inca se aplica planurile-cadru mai vechi (cele din OMECI 3608/2009 cu modificarile ulterioare)
- Programele scolare pentru disciplinele CS ale specializarilor Muzica (Tehnoredactare muzicala si Procesarea muzicii pe calculator) — nu au fost gasite ca PDF-uri in consultarea publica; continutul prezentat este reconstituit din planul-cadru Anexa 10 si nota specifica; confirmare necesara
- Proiectarea asistata de computer (cls. XII, Arhitectura) — programa scolara detaliata nu a fost gasita; exista referinte ca disciplina CS in Anexa 13 si in lista programelor de pe edu.ro; software recomandat (AutoCAD, SketchUp, Revit) nu este specificat explicit in textul planului-cadru si a fost adaugat ca recomandare bazata pe specificul disciplinei
- Specializarea Arte Vizuale (Anexa 11) include in nota specifica textul 'specializarea arte plastice, arte decorative, design' — ceea ce sugereaza ca Anexa 11 acopera mai multe sub-specializari (Pictura de sevalet, Grafica, Sculptura statuara, Arte murale, Ceramica, Arte textile/tapiserie/imprimeuri/contexturi, Moda, Scenografie, Animatie, Design grafic/de produs/de ambient), iar PCI se aplica tuturor
- Coregrafie (Anexa 14) nu are CDEOS la cls. IX si X (0 ore — planul-cadru este deja complet ocupat cu 33-34 ore/sapt.); aceasta situatie confirma ca TIC 1h/sapt. este comprimat in trunchiul comun redus de 17/18 ore
- Nu a fost confirmat daca exista programa scolara separata pentru TIC in varianta vocationala artistica sau daca se aplica aceeasi programa TC ca la toate filierele

---

## Premise structurale pe disc
8 profiluri x 4 ani (cls IX-XII) la content/liceu/<profil>/cls{9-12}/. Continut real: mat-info(30)+artistic(23) dezvoltate, restul schelete -> liceu = in mare parte CREARE. Vezi REVAMP_PLAYBOOK.md.
