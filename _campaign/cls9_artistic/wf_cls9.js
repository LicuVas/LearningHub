export const meta = {
  name: 'learninghub-cls9-artistic',
  description: 'Scrie materia de clasa a IX-a (profil artistic) pe programa aprobata: 29 de lectii in 3 module',
  phases: [
    { title: 'Scrie', detail: '29 de lectii, un agent pe lectie' },
    { title: 'Verifica', detail: 'preda ce cere programa, e adevarat, si nu a ramas nimic din sablon' },
  ],
}

// Materia pentru orele 9A si 9M de la Liceul de Arte "Victor Brauner".
// Programa APROBATA: Anexa 22 la OMEC 6.930/19.12.2025 - T.I.C. clasa a IX-a,
// trunchi comun, toate filierele si profilurile. Se aplica din 2026-2027.
// Textul aprobat (PDF scanat, trecut prin OCR) e pe disc si agentii il citesc:
//   C:/00/AI_0/knowledge/curriculum_liceu/TIC_IX_Anexa22_OMEC6930_2025_ocr.txt
//
// Fisierele EXISTA deja, cu instalatia corecta (cai, chei de progres, navigare)
// generata mecanic de schela.py. Continutul lor e inca al lectiei-sablon si trebuie
// inlocuit integral - de aceea fiecare fisier are un comentariu care incepe cu SCHELA.
const REPO = 'C:/00/Projects/LearningHub/'
const POARTA = 'C:/00/Projects/LearningHub/tools/verifica_lectie.py'
const QIO = 'C:/00/Projects/LearningHub/tools/quiz_io.py'
const PROGRAMA = 'C:/00/AI_0/knowledge/curriculum_liceu/TIC_IX_Anexa22_OMEC6930_2025_ocr.txt'
const SABLON = 'C:/00/Projects/LearningHub/content/liceu/artistic/cls9/m1-tic-baze/lectia1-sisteme-calcul.html'

const LECTII = [
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 1,
    "fisier": "lectia1-forme-comunicare.html",
    "titlu": "Formele comunicarii digitale si cand folosesti fiecare",
    "continut": "1.1 - concepte de baza si caracteristici ale formelor de comunicare si colaborare digitala: site-uri web, buletine informative, e-mail, chat, forum, platforme de discutii specializate, retele de socializare, apeluri vocale si video, videoconferinte; modalitati de feedback (formulare)",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia1-forme-comunicare.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia1-forme-comunicare",
    "ancora": "colaborare digital"
  },
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 2,
    "fisier": "lectia2-email-neticheta.html",
    "titlu": "E-mailul profesional si neticheta",
    "continut": "1.1 - repere pentru crearea de mesaje profesionale prin e-mail; respectarea netichetei specifice fiecarei forme de comunicare: adaptarea tonului formal/informal, simboluri expresive (emoticon)",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia2-email-neticheta.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia2-email-neticheta",
    "ancora": "colaborare digital"
  },
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 3,
    "fisier": "lectia3-gestionare-mesaje-risc.html",
    "titlu": "Gestionarea mesajelor si mesajele cu risc de securitate",
    "continut": "1.1 - gestionarea mesajelor (foldere, etichete, raspunsuri si redirectionari in e-mail si pe alte platforme); identificarea mesajelor cu risc de securitate",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia3-gestionare-mesaje-risc.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia3-gestionare-mesaje-risc",
    "ancora": "colaborare digital"
  },
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 4,
    "fisier": "lectia4-resurse-partajate.html",
    "titlu": "Resurse digitale partajate si feedbackul constructiv",
    "continut": "1.1 - crearea si partajarea de resurse digitale prin Internet, gestionarea in comun a resurselor (organizare, arhivare, accesibilitate), oferirea de feedback constructiv in colaborarea digitala",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia4-resurse-partajate.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia4-resurse-partajate",
    "ancora": "colaborare digital"
  },
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 5,
    "fisier": "lectia5-platforme-invatare.html",
    "titlu": "Aplicatii si platforme care sprijina invatarea",
    "continut": "1.2 - concepte, caracteristici si repere pentru identificarea si utilizarea unor aplicatii, platforme si instrumente adecvate pentru a sprijini invatarea (tutoriale, cursuri online); utilizarea responsabila si cu discernamant a inteligentei artificiale pentru invatare",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia5-platforme-invatare.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia5-platforme-invatare",
    "ancora": "colaborare digital"
  },
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 6,
    "fisier": "lectia6-ia-ce-este.html",
    "titlu": "Inteligenta artificiala: ce este si pe ce se sprijina",
    "continut": "1.3 - elemente care stau la baza IA (statistica, adaptivitate, sabloane, generare probabilistica de continut); diferente fata de gandirea umana; rolul deciziilor umane in proiectarea, selectia si validarea algoritmilor; tipologii si domenii de aplicare (clasificare, recomandare, predictie, generare, interactiune cu mediul)",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia6-ia-ce-este.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia6-ia-ce-este",
    "ancora": "inteligen"
  },
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 7,
    "fisier": "lectia7-ia-date-bias.html",
    "titlu": "Datele din spatele inteligentei artificiale: invatare automata si partinire",
    "continut": "1.3 - invatare automata in cadrul IA; datele ca fundament (surse, colectare, etichetare, actualizare in timp real, influenta datelor asupra rezultatelor); prejudecati - partinire (bias) sociala si culturala reflectate in date; confuzia intre fapte reale si fapte prezentate denaturat",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia7-ia-date-bias.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia7-ia-date-bias",
    "ancora": "inteligen"
  },
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 8,
    "fisier": "lectia8-modele-generative.html",
    "titlu": "Modele generative (LLM): cum le adresezi si cum le verifici",
    "continut": "1.3 - modele generative pentru crearea de continut digital (LLM): caracteristici, modalitati de adresare (descriere, asistent virtual - chatbot), credibilitate, adevar stiintific in raspunsurile generate; interactiune eficienta prin gandire critica, creativitate, gandire computationala, constiinta de sine si sociala",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia8-modele-generative.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia8-modele-generative",
    "ancora": "generative"
  },
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 9,
    "fisier": "lectia9-ia-responsabila.html",
    "titlu": "Inteligenta artificiala responsabila: drepturi, reglementare, mediu",
    "continut": "1.3 - responsabilitatea umana in proiectarea si testarea sistemelor; reglementari, transparenta si responsabilitate (auditare, drepturi fundamentale, confidentialitate, echitate); proprietate intelectuala, autenticitate si drepturi de autor pentru continutul generat de IA; sustenabilitate si impact ecologic (consum energetic, resurse naturale, amprenta de carbon); beneficii si limitari",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia9-ia-responsabila.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia9-ia-responsabila",
    "ancora": "inteligen"
  },
  {
    "modul": "m1-societate-digitala",
    "modul_titlu": "Societate digitala",
    "domeniu": "1. Societate digitala (1.1 - 1.4)",
    "nr": 10,
    "fisier": "lectia10-tehnologii-emergente.html",
    "titlu": "Tehnologii emergente: realitatea virtuala si augmentata",
    "continut": "1.4 - caracteristici ale unor tehnologii emergente din punctul de vedere al impactului; realitate extinsa: realitate virtuala si realitate augmentata; scenarii de utilizare pentru o problema cotidiana",
    "cale": "content/liceu/artistic/cls9/m1-societate-digitala/lectia10-tehnologii-emergente.html",
    "cheie": "artistic-cls9-m1-societate-digitala-lectia10-tehnologii-emergente",
    "ancora": "emergente"
  },
  {
    "modul": "m2-continuturi-digitale",
    "modul_titlu": "Continuturi digitale",
    "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
    "nr": 1,
    "fisier": "lectia1-text-ascii-unicode.html",
    "titlu": "Cum este reprezentat textul: ASCII si UNICODE",
    "continut": "2.1 - concepte de baza si caracteristici ale continuturilor de tip text: reprezentarea textului in memorie, utilizarea seturilor de caractere, codificarea ASCII si UNICODE",
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia1-text-ascii-unicode.html",
    "cheie": "artistic-cls9-m2-continuturi-digitale-lectia1-text-ascii-unicode",
    "ancora": "Birotic"
  },
  {
    "modul": "m2-continuturi-digitale",
    "modul_titlu": "Continuturi digitale",
    "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
    "nr": 2,
    "fisier": "lectia2-formatare-profesionala.html",
    "titlu": "Formatare profesionala: stiluri, indentari, tabulatori",
    "continut": "2.1 - instrumente pentru formatarea profesionala a unui document: stiluri, indentari, tabulatori",
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia2-formatare-profesionala.html",
    "cheie": "artistic-cls9-m2-continuturi-digitale-lectia2-formatare-profesionala",
    "ancora": "Birotic"
  },
  {
    "modul": "m2-continuturi-digitale",
    "modul_titlu": "Continuturi digitale",
    "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
    "nr": 3,
    "fisier": "lectia3-aspect-pagina.html",
    "titlu": "Aspectul paginii: intreruperi, sectiuni si scriere pe coloane",
    "continut": "2.1 - aspectul paginii, intreruperi de pagina, scriere pe coloane",
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia3-aspect-pagina.html",
    "cheie": "artistic-cls9-m2-continuturi-digitale-lectia3-aspect-pagina",
    "ancora": "Birotic"
  },
  {
    "modul": "m2-continuturi-digitale",
    "modul_titlu": "Continuturi digitale",
    "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
    "nr": 4,
    "fisier": "lectia4-documente-lungi.html",
    "titlu": "Documente lungi: cuprins automat, liste de imagini si tabele",
    "continut": "2.1 - nivel avansat: generarea automata a cuprinsului, liste de imagini si tabele, proprietati ale documentului, verificarea automata ortografica si gramaticala",
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia4-documente-lungi.html",
    "cheie": "artistic-cls9-m2-continuturi-digitale-lectia4-documente-lungi",
    "ancora": "Birotic"
  },
  {
    "modul": "m2-continuturi-digitale",
    "modul_titlu": "Continuturi digitale",
    "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
    "nr": 5,
    "fisier": "lectia5-colaborare-document.html",
    "titlu": "Lucrul in echipa pe un document: comentarii si urmarirea modificarilor",
    "continut": "2.1 - nivel avansat: comentarii, gestionarea modificarilor",
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia5-colaborare-document.html",
    "cheie": "artistic-cls9-m2-continuturi-digitale-lectia5-colaborare-document",
    "ancora": "Birotic"
  },
  {
    "modul": "m2-continuturi-digitale",
    "modul_titlu": "Continuturi digitale",
    "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
    "nr": 6,
    "fisier": "lectia6-imbinare-corespondenta.html",
    "titlu": "Imbinarea corespondentei (Mail Merge)",
    "continut": "2.1 - nivel avansat: imbinarea corespondentei - conectarea unui document la o sursa de date, in vederea trimiterii de invitatii sau scrisori personalizate",
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia6-imbinare-corespondenta.html",
    "cheie": "artistic-cls9-m2-continuturi-digitale-lectia6-imbinare-corespondenta",
    "ancora": "Birotic"
  },
  {
    "modul": "m2-continuturi-digitale",
    "modul_titlu": "Continuturi digitale",
    "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
    "nr": 7,
    "fisier": "lectia7-ecuatii-campuri-ia.html",
    "titlu": "Ecuatii, simboluri, campuri automate si IA in prelucrarea textului",
    "continut": "2.1 - formatarea obiectelor utilizate intr-un document (ecuatii si simboluri, campuri automate); utilizarea responsabila a IA in prelucrarea de texte (redactare, corectare, traducere); adaptarea produsului digital la publicul tinta si la scopul comunicarii",
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia7-ecuatii-campuri-ia.html",
    "cheie": "artistic-cls9-m2-continuturi-digitale-lectia7-ecuatii-campuri-ia",
    "ancora": "Birotic"
  },
  {
    "modul": "m2-continuturi-digitale",
    "modul_titlu": "Continuturi digitale",
    "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
    "nr": 8,
    "fisier": "lectia8-prezentari-baze.html",
    "titlu": "Prezentari digitale: coordonatorul de diapozitive si temele",
    "continut": "2.2 - concepte de baza si caracteristici ale prezentarilor digitale; formatare profesionala: coordonator de diapozitive, teme predefinite",
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia8-prezentari-baze.html",
    "cheie": "artistic-cls9-m2-continuturi-digitale-lectia8-prezentari-baze",
    "ancora": "Prezent"
  },
  {
    "modul": "m2-continuturi-digitale",
    "modul_titlu": "Continuturi digitale",
    "domeniu": "2. Continuturi digitale, tehnologii si aplicatii specializate (2.1 - 2.2)",
    "nr": 9,
    "fisier": "lectia9-prezentari-interactive.html",
    "titlu": "Prezentari interactive: butoane de actiune, legaturi, multimedia",
    "continut": "2.2 - interactivitate (butoane de actiune, legaturi), integrarea de elemente multimedia, animatii si tranzitii personalizate, expunere personalizata; utilizarea responsabila a IA in generarea de prezentari",
    "cale": "content/liceu/artistic/cls9/m2-continuturi-digitale/lectia9-prezentari-interactive.html",
    "cheie": "artistic-cls9-m2-continuturi-digitale-lectia9-prezentari-interactive",
    "ancora": "Prezent"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 1,
    "fisier": "lectia1-arhitectura.html",
    "titlu": "Sisteme desktop si mobile; arhitectura unui sistem de calcul",
    "continut": "3.1 - caracteristici, utilizare, avantaje si dezavantaje ale sistemelor de tip desktop (birou, educatie, jocuri) si de tip mobil (laptopuri, telefoane inteligente, tablete); arhitectura sistemului de calcul: concepte de baza si caracteristici ale componentelor, fluxul datelor si al instructiunilor",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia1-arhitectura.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia1-arhitectura",
    "ancora": "Sisteme de calcul"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 2,
    "fisier": "lectia2-procesorul.html",
    "titlu": "Procesorul (CPU): unitatea logico-aritmetica, comanda si cache",
    "continut": "3.1 - unitatea centrala de procesare: structura interna (unitatea logico-aritmetica, unitatea de comanda si control, cache); parametri care influenteaza performanta (numar de nuclee, frecventa, cache)",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia2-procesorul.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia2-procesorul",
    "ancora": "Sisteme de calcul"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 3,
    "fisier": "lectia3-memoria.html",
    "titlu": "Memoria interna: RAM si ROM",
    "continut": "3.1 - memoria interna (RAM - Random Access Memory, ROM - Read Only Memory): rol, caracteristici, asemanari si deosebiri, parametri care influenteaza performanta",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia3-memoria.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia3-memoria",
    "ancora": "Sisteme de calcul"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 4,
    "fisier": "lectia4-stocarea.html",
    "titlu": "Stocarea datelor: HDD, SSD, medii optice, carduri, memorie flash",
    "continut": "3.1 - medii si dispozitive de stocare: caracteristici, utilizare, avantaje si dezavantaje (HDD, SSD, medii optice, card de memorie, memorie flash); parametri care influenteaza performanta",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia4-stocarea.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia4-stocarea",
    "ancora": "Sisteme de calcul"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 5,
    "fisier": "lectia5-placa-baza-interfete.html",
    "titlu": "Placa de baza, magistralele, BIOS/UEFI si interfetele",
    "continut": "3.1 - placa de baza: structura (magistrale de date, adresa si control, chipseturi si BIOS/UEFI), rol; interfete: caracteristici ale principalelor interfete (placa de sunet, placa de retea, placa video, USB)",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia5-placa-baza-interfete.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia5-placa-baza-interfete",
    "ancora": "Sisteme de calcul"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 6,
    "fisier": "lectia6-periferice-intrare.html",
    "titlu": "Periferice de intrare: de la tastatura la scanere 3D si RFID",
    "continut": "3.1 - caracteristici, utilitate, avantaje, dezavantaje si parametri ai perifericelor de intrare uzuale: tastatura, mouse, microfon, camera digitala, scanere 2D (imagini, coduri de bare sau QR, citire optica a caracterelor - OCR), scanere 3D, cititor RFID",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia6-periferice-intrare.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia6-periferice-intrare",
    "ancora": "Sisteme de calcul"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 7,
    "fisier": "lectia7-periferice-iesire.html",
    "titlu": "Periferice de iesire si de intrare-iesire",
    "continut": "3.1 - periferice de iesire: monitor, imprimanta, imprimanta 3D, plotter, boxe, videoproiector; periferice de intrare-iesire: touchscreen, controler de joc cu feedback, dispozitive cu NFC",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia7-periferice-iesire.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia7-periferice-iesire",
    "ancora": "Sisteme de calcul"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 8,
    "fisier": "lectia8-alimentare-racire.html",
    "titlu": "Alimentare si racire: surse, TDP si metode de racire",
    "continut": "3.1 - sisteme de alimentare si racire: surse de alimentare, TDP (cantitatea maxima de caldura generata de componente), metode de racire (pasiva, activa, cu lichid)",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia8-alimentare-racire.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia8-alimentare-racire",
    "ancora": "Sisteme de calcul"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 9,
    "fisier": "lectia9-sistemul-de-operare.html",
    "titlu": "Software si sistemul de operare: tipuri, functii, sisteme de fisiere",
    "continut": "3.2 - tipuri principale de software (de sistem, aplicatii); concepte de baza si caracteristici ale unui sistem de operare: tipuri (desktop, servere, dispozitive mobile, industriale), functii principale, interfete (grafica, bazata pe gesturi); tipuri comune de sisteme de fisiere (NTFS, FAT32, exFAT, EXT, APFS)",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia9-sistemul-de-operare.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia9-sistemul-de-operare",
    "ancora": "software"
  },
  {
    "modul": "m3-sisteme-de-calcul",
    "modul_titlu": "Sisteme de calcul",
    "domeniu": "3. Sisteme de calcul (3.1 - 3.2)",
    "nr": 10,
    "fisier": "lectia10-fisiere-securitate.html",
    "titlu": "Gestionarea fisierelor si securizarea sistemului",
    "continut": "3.2 - gestionarea profesionala a folderelor si fisierelor (organizare ierarhica, arhivare), monitorizarea proceselor; securizarea sistemului de operare (firewall, software antivirus, gestionarea utilizatorilor si a permisiunilor, criptare)",
    "cale": "content/liceu/artistic/cls9/m3-sisteme-de-calcul/lectia10-fisiere-securitate.html",
    "cheie": "artistic-cls9-m3-sisteme-de-calcul-lectia10-fisiere-securitate",
    "ancora": "software"
  }
]

const R_SCHEMA = {
  type: 'object',
  required: ['fisier', 'scris', 'atomi', 'intrebari', 'nota'],
  properties: {
    fisier: { type: 'string' },
    scris: { type: 'boolean' },
    atomi: { type: 'integer' },
    intrebari: { type: 'integer' },
    nota: { type: 'string' },
  },
}

const V_SCHEMA = {
  type: 'object',
  required: ['verdict', 'probleme'],
  properties: {
    verdict: { type: 'string', enum: ['CURAT', 'PROBLEME'] },
    probleme: { type: 'array', items: { type: 'string' } },
  },
}

phase('Scrie')
log('Scriu ' + LECTII.length + ' lectii de clasa a IX-a, pe programa aprobata.')

const rez = await pipeline(
  LECTII,
  (L) => agent(
    'Esti profesor de Informatica/T.I.C. si scrii o lectie NOUA pentru clasa a IX-a, la un liceu de ARTE.\n\n' +
    'CONTEXTUL: din 2026-2027 clasa a IX-a intra pe programa noua. Fisierul exista deja, cu instalatia corecta (cai, chei de progres, navigare), dar continutul lui e inca al unei lectii-sablon despre componentele sistemului de calcul. Il inlocuiesti INTEGRAL.\n\n' +
    'FISIERUL: ' + REPO + L.cale + '\n' +
    'TITLUL LECTIEI: ' + L.titlu + '\n' +
    'Lectia ' + L.nr + ' din modulul "' + L.modul_titlu + '"\n\n' +
    'CE CERE PROGRAMA, exact (copiat din anexa aprobata):\n' + L.continut + '\n' +
    'Domeniul: ' + L.domeniu + '\n\n' +
    'PASUL 1 - citeste programa si sablonul:\n' +
    'grep -n -A 12 -i "' + L.ancora + '" "' + PROGRAMA + '" | head -60\n' +
    'Programa e text obtinut prin OCR dintr-un PDF scanat: literele pot fi stalcite pe alocuri (de exemplu "hitps" in loc de "https"). Citeste sensul, nu ortografia.\n' +
    'Ca sa vezi FORMA pe care trebuie s-o pastrezi, deschide sablonul: ' + SABLON + '\n\n' +
    'PASUL 2 - scrie lectia. Structura ramane exact cea din fisier:\n' +
    '  - <title> si <h1> sunt DEJA corecte, nu le atinge\n' +
    '  - obiectivul lectiei (goal-section) si lista "Dupa aceasta lectie vei putea" (3-6 puncte, fiecare cu verb de actiune verificabil)\n' +
    '  - sectiunea "Incearca!" (try-section): o provocare scurta de deschidere, inainte de teorie\n' +
    '  - 5-7 ATOMI in <main id="atomic-content">, fiecare cu <div class="atom" id="atom-N" data-quiz=...>, cu antet, continut si <div class="atom-quiz"></div>\n' +
    '  - 3 exercitii pe niveluri (minim / standard / performanta), fiecare cu rezolvare model in <details class="practice-solution"><summary>Vezi rezolvarea</summary><div class="practice-solution-body">...</div></details>\n' +
    '  - caseta de recapitulare "Ce ai invatat astazi"\n\n' +
    'ADAPTEAZA LA LICEUL DE ARTE. Programa e aceeasi pentru toate profilurile, dar exemplele nu: elevii tai sunt la muzica, arte vizuale, coregrafie, arta actorului. Exemplele vin din lumea lor (un afis de concert, un portofoliu de lucrari, o inregistrare, un program de spectacol), nu dintr-un birou de contabilitate. NU transforma lectia intr-una de specialitate: T.I.C. ramane T.I.C.\n\n' +
    'REGULI DE FOND:\n' +
    '1. Tot ce afirmi trebuie sa fie ADEVARAT: meniuri care exista, scurtaturi reale, cifre verificabile. Daca nu poti sustine o afirmatie, scrie varianta prudenta sau las-o afara.\n' +
    '2. Programa spune pe ce se lucreaza: pentru Societate digitala - Google Workspace sau Microsoft Teams; pentru Continuturi digitale - LibreOffice sau Microsoft Office; pentru Sisteme de calcul - Linux (Ubuntu) sau Windows. Da pasii pentru cel putin una si spune unde difera la cealalta.\n' +
    '3. Chestionarele: 4 variante de lungime apropiata (+/-20% fata de medie); varianta corecta NU are voie sa fie cea mai lunga. Distractorii sunt greseli pe care un elev de a IX-a chiar le face. Indiciul explica CONTINUTUL, niciodata litera. Cheia corecta sa NU cada mereu pe aceeasi litera.\n' +
    '4. data-quiz e o LISTA JSON, iar "correct" e o singura litera. Un obiect in loc de lista omoara toata pagina.\n' +
    '5. Exercitiile cer doar ce s-a predat in ACEASTA lectie.\n' +
    '6. Exemplul INAINTE de definitie, in fiecare atom introductiv.\n' +
    '7. Romana FARA diacritice, ca in restul sitului.\n\n' +
    'NU ATINGE: numele fisierului, calea, cheile de progres (AtomicLearning/PracticeSimple/LessonSummary.init), Breadcrumb.init, LearningProgress.init, caile catre scripturi si stiluri, legaturile inainte/inapoi din nav si din caseta finala.\n' +
    'SCOATE comentariul care incepe cu "SCHELA:" - el marcheaza fisierele nescrise inca.\n\n' +
    'PASUL 3 - verifica-te, intr-un singur apel Bash:\n' +
    'python "' + POARTA + '" "' + L.cale + '" && python "' + QIO + '" dump "' + L.cale + '"\n' +
    'Poarta trebuie sa iasa cu OK. Repara ce semnaleaza si ruleaza din nou.\n\n' +
    'Raporteaza cati atomi si cate intrebari ai scris, si orice n-ai putut face.',
    { label: 'cls9:' + L.fisier, phase: 'Scrie', model: 'opus', schema: R_SCHEMA }
  ),
  (r, L) => {
    if (!r || !r.scris) return { L, r, v: null }
    return agent(
      'Esti profesor corector, exigent. O lectie noua de clasa a IX-a tocmai a fost scrisa. Verific-o.\n\n' +
      'LECTIA: ' + REPO + L.cale + '\n' +
      'TITLU: ' + L.titlu + '\n' +
      'CE CEREA PROGRAMA:\n' + L.continut + '\n\n' +
      'Ruleaza intai poarta: python "' + POARTA + '" "' + L.cale + '"\n' +
      'Apoi citeste lectia si raspunde, in ordinea gravitatii:\n' +
      '1. A RAMAS ceva din lectia-sablon (componentele sistemului de calcul, hardware/software, organizarea fisierelor) intr-o lectie care nu e despre asta? Mai exista comentariul "SCHELA:"?\n' +
      '2. Preda ce cere programa, sau doar se apropie? Numeste ce lipseste din lista de mai sus.\n' +
      '3. Contine ceva FALS? Meniuri sau scurtaturi inventate, cifre gresite, afirmatii tehnice care nu se verifica.\n' +
      '4. Chestionarele: cheia e corecta la fiecare intrebare? Varianta corecta e vizibil mai lunga decat celelalte? Indiciul numeste vreo litera? Cad toate cheile pe aceeasi litera?\n' +
      '5. Exercitiile cer ceva ce NU s-a predat in aceasta lectie?\n' +
      '6. Exemplele sunt adaptate unui liceu de ARTE, sau sunt generice de birou?\n\n' +
      'Nu semnala stil sau lungime. Raporteaza CURAT sau PROBLEME cu lista exacta.',
      { label: 'verif-cls9:' + L.fisier, phase: 'Verifica', model: 'sonnet', schema: V_SCHEMA }
    ).then(v => ({ L, r, v }))
  }
)

const bune = rez.filter(Boolean)
const scrise = bune.filter(x => x.r && x.r.scris)
const cuProbleme = bune.filter(x => x.v && x.v.verdict === 'PROBLEME')
log('Scrise: ' + scrise.length + ' din ' + LECTII.length + '. Cu probleme: ' + cuProbleme.length + '.')

return {
  planificate: LECTII.length,
  scrise: scrise.length,
  atomi: scrise.reduce((a, x) => a + (x.r.atomi || 0), 0),
  intrebari: scrise.reduce((a, x) => a + (x.r.intrebari || 0), 0),
  nescrise: bune.filter(x => x.r && !x.r.scris).map(x => ({ fisier: x.L.cale, nota: x.r.nota })),
  probleme: cuProbleme.map(x => ({ fisier: x.L.cale, probleme: x.v.probleme })),
  note: scrise.filter(x => x.r.nota && x.r.nota.length > 60).map(x => ({ fisier: x.L.fisier, nota: x.r.nota })),
}
